/* eslint-disable no-restricted-syntax */
const request = require('request');
const HTMLParser = require('node-html-parser');
const recipeSites = require('./recipeSiteIndex').recipeSites; // delete require.cache[require.resolve('recipeSiteIndex.json')]
const logger = require('../logging/logger');

const recipeParser = (function recipeParser() {
  let hostName; let fullSiteContents; let htmlRoot;

  function _doRequest(url) {
    return new Promise(((resolve, reject) => {
      const customHeaderRequest = request.defaults({
        headers: { 'User-Agent': 'Mozilla/4.0' },
        gzip: true,
      });
      customHeaderRequest.get(url, (error, res, body) => {
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
  function _addPrintUrl(siteObject) {
    let mainUrl = '';
    const returnSiteObject = siteObject;
    let truncateIndex = _nthIndex(siteObject.url, '/', siteObject.urlInfo.truncateCount);
    if (truncateIndex === -1) {
      truncateIndex = siteObject.url.indexOf('?');
    }
    mainUrl = siteObject.url.substr(0, truncateIndex);
    returnSiteObject.printUrl = `${mainUrl}/${siteObject.urlInfo.printKeyword}`;
    return returnSiteObject;
  }
  function _getRecipeName(selector) {
    const nameNode = htmlRoot.querySelector(selector);
    return nameNode.text;
  }
  function findNode(wordToFind, array) {
    for (const node of array) {
      if (node.classNames) {
        for (const className of node.classNames) {
          if (className.indexOf(wordToFind) > -1) {
            return node;
          }
        }
        if (node.childNodes) {
          const foundNode = findNode(wordToFind, node.childNodes);
          if (foundNode) return foundNode;
        }
      }
    }
  }
  function _getRecipeBody(selectors) {
    let recipe = '';
    if (selectors.length === 0) {
      return htmlRoot.innerHTML.toString();
    }
    for (let i = 0; i < selectors.length; i++) {
      const foundElement = htmlRoot.querySelector(selectors[i]);
      if (foundElement) {
        recipe += htmlRoot.querySelector(selectors[i]).toString();
      }
    }
    let foundNode = findNode('custom-recipe', htmlRoot.childNodes);
      recipe = htmlRoot.structure.toString();
      recipe = foundNode.toString();
    if (recipe.length < 1) {
      // something didn't work, just get text?
      
    }
    return recipe;
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
  function _addUrlProtocol(url) {
    // get rid of everything before the domain and give http protocol
    return `https://${url.slice(url.indexOf(hostName))}`;
  }
  function _findPrintUrl(str) {
    // ("([^"]+?)www\.ambitiouskitchen\.com([^"]+?)print(.*?)")
    const hostnameRegex = hostName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`("([^"]{0,20}?)${hostnameRegex}([^"]+?)print(.*?)")`, 'gmi');
    const matchesArr = regex.exec(str);
    if (matchesArr && matchesArr.length === 1) {
      const dirtyUrl = matchesArr[0];
      // remove query strings
      const queryStringRegex = /("(.+?)(\?|"))/gm;
      const cleanerUrl = queryStringRegex.exec(dirtyUrl)[0];
      // trim beginning and ending characters
      const cleanUrl = cleanerUrl.substr(1).slice(0, -1);
      const finalUrl = _addUrlProtocol(cleanUrl);
      return finalUrl;
    }
    // couldn't find print url, site probably doesn't have one
    return null;
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
    if (printUrl !== null) {
      // validate this url here
      try {
        fullSiteContents = await _doRequest(printUrl);
      } catch (err) {
        // return error here or something
      }
    }
    _parseHtml(fullSiteContents);
    const recipeContents = _getRecipeBody(['body']);
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
    const recipeName = _getRecipeName(siteObject.recipeNameIdentifier);
    const recipeContents = _getRecipeBody(siteObject.recipeNodeIdentifiers);
    const useIframe = siteObject.useIframe;
    const printUrl = siteObject.printUrl;
    return {
      url, recipeContents, recipeName, useIframe, printUrl,
    };
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
