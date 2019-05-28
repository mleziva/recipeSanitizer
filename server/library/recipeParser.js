const request = require('request');
const HTMLParser = require("node-html-parser");

var recipeParser = (function () {
    'use strict';

    var hostName = '';

    function getRecipe(url, callback) {
        hostName = new URL(url).hostname;
        var printUrl = _createPrintUrl(url);
        return _getPrintableText(printUrl, callback);
    };
    function _getPrintableText(url, callback) {
        request(url, { json: false }, (err, res, body) => {
            if (err) { return console.log(err); }
            var recipe = _getPrintableRecipe(body, '.recipe-print__container');
            return callback(recipe, false);
        });
    };
    function _createPrintUrl(url) {
        var printUrl = '';
        if (hostName.includes('allrecipes.com')) {
            var lastSlash = _nthIndex(url, '/', 6)
            var mainUrl = url.substr(0, lastSlash)
            printUrl = mainUrl + '/print';
        }
        //allrecieps pattern: https://www.allrecipes.com/recipe/245559/fall-infused-mashed-potatoes/print/
        //hostname/recipe/{id}/{name}/print
        return printUrl;
    };
    function _getPrintableRecipe(content, selector) {
        var root = HTMLParser.parse(content);
        var recipe = root.querySelector(selector);
        return recipe.toString();
    };
    function _nthIndex(str, pat, n) {
        var L = str.length, i = -1;
        while (n-- && i++ < L) {
            i = str.indexOf(pat, i);
            if (i < 0) break;
        }
        return i;
    };
    async function executeAsyncTask() {
        const valueA = await functionA()
        const valueB = await functionB(valueA)
        return function3(valueA, valueB)
    }
    async function getRecipe2(url, callback) {
        //get page as string
        //search with regex for link to print page
        //strip out querystrings
        //request that print page
        //get title
        //get title container and return just the contents of that
        let fullSiteContents, printSiteContents, printUrl;
        try {
            fullSiteContents = await _doRequest(url)
        } catch (err) {
            logger.error('Http error', err)
            return res.status(500).send()
        };
        printUrl = _findPrintUrl(fullSiteContents);
        try {
            fullSiteContents = await _doRequest(printUrl)
        } catch (err) {
            logger.error('Http error', err)
            return res.status(500).send()
        };
        return fullSiteContents;
    };

    function _findPrintUrl(str) {
        const regex = /(="(https?|www|\/\/www)(.+?)print(.+?)")/gm;
        var dirtyUrl = regex.exec(str)[0];
        //remove query strings
        const queryStringRegex = /(="(.+?)(\?|"))/gm;
        var cleanerUrl = queryStringRegex.exec(dirtyUrl)[0];
        //trim beginning and ending characters
        var cleanUrl = cleanerUrl.substr(2).slice(0, -1);
        return cleanUrl;
    };
    function _doRequest(url) {
        return new Promise(function (resolve, reject) {
          request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
              resolve(body);
            } else {
              reject(error);
            }
          });
        });
      }
    return {
        getRecipe: getRecipe,
        getRecipe2: getRecipe2
    };
}());

module.exports = recipeParser;