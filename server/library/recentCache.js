
var RecentCacheSingleton = (function () {
    this.recentSearches = new Array();
    this.addSearch = function (searchedObject) {
        recentSearches.unshift(searchedObject);
        if(recentSearches.length >= 20){
            recentSearches.length = 20;
        }
    }
    return this;
})();

module.exports = RecentCacheSingleton;