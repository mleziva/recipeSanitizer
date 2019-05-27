const NodeCache = require( "node-cache" );

var recentRecipes = (function() {
    'use strict';
 
     var hostName = '';
     
    function addRecent(url, callback){
        hostName = new URL(url).hostname;
        var printUrl = _createPrintUrl(url);
        return _getPrintableText(printUrl, callback);
    };
    function getRecent(url, callback){
        hostName = new URL(url).hostname;
        var printUrl = _createPrintUrl(url);
        return _getPrintableText(printUrl, callback);
    };
}());

module.exports = recentRecipes;