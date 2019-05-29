const request = require('request');
const HTMLParser = require('node-html-parser');

const recipeParser = (function recipeParser() {
  let hostName; let fullSiteContents; let htmlRoot;

  function _doRequest(url) {
    return new Promise(((resolve, reject) => {
      request(url, (error, res, body) => {
        if (!error && res.statusCode === 200) {
          resolve(body);
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
  function _createPrintUrl(url) {
    let printUrl = '';
    if (hostName.includes('allrecipes.com')) {
      const lastSlash = _nthIndex(url, '/', 6);
      const mainUrl = url.substr(0, lastSlash);
      printUrl = `${mainUrl}/print`;
    }
    // allrecieps pattern: https://www.allrecipes.com/recipe/245559/fall-infused-mashed-potatoes/print/
    // hostname/recipe/{id}/{name}/print
    return printUrl;
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


  async function tryGetIndexedRecipe(url) {
    hostName = new URL(url).hostname;
    // load hostname from indexfile
    const printUrl = _createPrintUrl(url);
    try {
      fullSiteContents = await _doRequest(printUrl);
    } catch (err) {
      // return error here or something
    }
    _parseHtml(fullSiteContents);
    const recipeContents = _getRecipeBody('.recipe-print__container');
    const recipeName = _getRecipeName('.recipe-print__title');
    return { url, recipeContents, recipeName };
  }

  async function getRecipe(url) {
    let recipeObj;
    // get known recipe
    recipeObj = tryGetIndexedRecipe(url);
    if (recipeObj === null) {
      // index doesn't have that site;
      // get unknown recipe
      recipeObj = 'test';
    }
    return recipeObj;
  }


  async function getRecipe2(url, callback) {
    // if page is not stored in list
    // get page as string
    // search with regex for link to print page
    // strip out querystrings
    // request that print page
    // get title
    // print page and set title
    let fullSiteContents; let printSiteContents; let
      printUrl;
    try {
      fullSiteContents = await _doRequest(url);
    } catch (err) {
      logger.error('Http error', err);
      return res.status(500).send();
    }
    printUrl = _findPrintUrl(fullSiteContents);
    try {
      fullSiteContents = await _doRequest(printUrl);
    } catch (err) {
      logger.error('Http error', err);
      return res.status(500).send();
    }
    return fullSiteContents;
  }

  function _findPrintUrl(str) {
    const regex = /(="(https?|www|\/\/www)(.+?)print(.+?)")/gm;
    const dirtyUrl = regex.exec(str)[0];
    // remove query strings
    const queryStringRegex = /(="(.+?)(\?|"))/gm;
    const cleanerUrl = queryStringRegex.exec(dirtyUrl)[0];
    // trim beginning and ending characters
    const cleanUrl = cleanerUrl.substr(2).slice(0, -1);
    return cleanUrl;
  }

  return {
    getRecipe,
    getRecipe2,
  };
}());

module.exports = recipeParser;
