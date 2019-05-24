const request = require('request');
const HTMLParser = require("node-html-parser");

var recipeParser = (function() {
    'use strict';
 
     var hostName = '';
     
    function getRecipe(url, callback){
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

    return {
        getRecipe: getRecipe,
    };
}());

module.exports = recipeParser;