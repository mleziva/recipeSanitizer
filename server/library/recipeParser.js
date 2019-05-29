const request = require('request');
const HTMLParser = require('node-html-parser');
const zlib = require('zlib');
const recipeSites = require('./recipeSiteIndex').recipeSites; // delete require.cache[require.resolve('file.json')]

const recipeParser = (function recipeParser() {
  let hostName; let fullSiteContents; let htmlRoot;

  function _doRequest(url) {
    return new Promise(((resolve, reject) => {
      const customHeaderRequest = request.defaults({
        headers: { 'User-Agent': 'Mozilla/4.0' },
      });
      customHeaderRequest.get(url, (error, res, body) => {
        if (!error && res.statusCode === 200) {
          // If response is gzip, unzip first
          const encoding = res.headers['content-encoding'];
          if (encoding && encoding.indexOf('gzip') >= 0) {
            zlib.unzip(body, function(err, dezipped) {
              let json_string = dezipped.toString('utf-8');
              resolve(json_string);
            });
          } else {
            // Response is not gzipped
            resolve(body);
          }
        } else {
          reject(error);
        }
      });
    }));
  }
  function _nthIndex(str, pat, numToGet) {
    const L = str.length; let
      i = -1; let n = numToGet;
    while (n-- && i++ < L) {
      i = str.indexOf(pat, i);
      if (i < 0) break;
    }
    return i;
  }
  function _addPrintUrl(siteObject) {
    const returnSiteObject = siteObject;
    const lastSlash = _nthIndex(siteObject.url, '/', siteObject.urlInfo.truncateCount);
    const mainUrl = siteObject.url.substr(0, lastSlash);
    returnSiteObject.printUrl = `${mainUrl}/${siteObject.urlInfo.printKeyword}`;
    return returnSiteObject;
  }
  function _getRecipeName(selector) {
    const nameNode = htmlRoot.querySelector(selector);
    return nameNode.text;
  }
  function _getRecipeBody(selector) {
    const recipe = htmlRoot.querySelector(selector);
    return recipe.toString();
  }
  function _parseHtml(content) {
    htmlRoot = HTMLParser.parse(content, {
      script: false,
      style: false,
      pre: false,
    });
  }
  function _getSiteObjectFromIndex(url) {
    hostName = new URL(url).hostname;
    let siteObject = null;
    for (let i = 0; i < recipeSites.length; i++) {
      if (recipeSites[i].hostName === hostName) {
        siteObject = recipeSites[i];
        siteObject.url = url;
        break;
      }
    }
    return siteObject;
  }
  function _findPrintUrl(str) {
    // ("([^"]+?)www\.ambitiouskitchen\.com([^"]+?)print(.*?)")
    const hostnameRegex = hostName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`("([^"]+?)${hostnameRegex}([^"]+?)print(.*?)")`, 'gm');
    const dirtyUrl = regex.exec(str)[0];
    // remove query strings
    const queryStringRegex = /("(.+?)(\?|"))/gm;
    const cleanerUrl = queryStringRegex.exec(dirtyUrl)[0];
    // trim beginning and ending characters
    const cleanUrl = cleanerUrl.substr(1).slice(0, -1);
    return cleanUrl;
  }

  async function getUnindexedRecipe(url) {
    // if page is not stored in list
    // get page as string
    // search with regex for link to print page
    // strip out querystrings
    // request that print page
    // get title
    try {
      fullSiteContents = await _doRequest(url);
    } catch (err) {
      // return error here or something
    }
    const printUrl = _findPrintUrl(fullSiteContents);
    // validate this url here
    try {
      fullSiteContents = await _doRequest(printUrl);
    } catch (err) {
      // return error here or something
    }
    _parseHtml(fullSiteContents);
    const recipeContents = _getRecipeBody('body');
    const recipeName = _getRecipeName('title');
    return { url, recipeContents, recipeName };
  }


  async function tryGetIndexedRecipe(url) {
    let siteObject = _getSiteObjectFromIndex(url);
    if (siteObject == null) {
      throw new Error('site is not in index');
    }
    siteObject = _addPrintUrl(siteObject);
    fullSiteContents = await _doRequest(siteObject.printUrl).catch((err) => { console.log(err); });
    _parseHtml(fullSiteContents);
    const recipeContents = _getRecipeBody(siteObject.recipeNodeIdentifier);
    const recipeName = _getRecipeName(siteObject.recipeNameIdentifier);
    return { url, recipeContents, recipeName };
  }

  async function getRecipe(url) {
    let recipeObj;
    try {
      recipeObj = await tryGetIndexedRecipe(url);
    } catch (error) {
      recipeObj = await getUnindexedRecipe(url);
    }
    return recipeObj;
  }
  return {
    getRecipe,
  };
}());

module.exports = recipeParser;
