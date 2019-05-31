/* eslint-disable func-names */
const socketSingleton = require('./socketSingleton');

const RecentCacheSingleton = (function () {
  this.recentSearches = [];
  function addUnique(searchedObject) {
    let found = false;
    for (let i = 0; i < this.recentSearches.length; i++) {
      if (this.recentSearches[i].name === searchedObject.name) {
        found = true;
        break;
      }
    }
    if (!found) {
      this.recentSearches.unshift(searchedObject);
      socketSingleton.io.emit('newSearch', searchedObject);
    }
  }
  this.addSearch = function (searchedObject) {
    addUnique(searchedObject);
    if (this.recentSearches.length >= 20) {
      this.recentSearches.length = 20;
    }
  };
  return this;
}());

module.exports = RecentCacheSingleton;
