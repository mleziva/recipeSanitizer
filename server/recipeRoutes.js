var express = require('express');
var router = express.Router();
var socketSingleton = require('./library/socketSingleton');

const RecipeParser = require("./library/recipeParser");
const recipeCache = require("./library/recentCache");
var i = 0;
/* GET home page. */
router.get('/', function (req, res, next) {
    res.json('Express RESTful API Time:' + new Date(Date.now()).toTimeString());
});

router.get('/recipe', function (req, res, next) {
    try{
        var thisRequest = i++;
        var searchedUrl = req.query.recipeUrl || "https://www.allrecipes.com/recipe/245559/fall-infused-mashed-potatoes/?internalSource=staff%20pick&referringId=1540&referringContentType=Recipe%20Hub";
        //try to get name from url
        //save search to cache
        recipeCache.addSearch({name: "t " +thisRequest, url: searchedUrl})
        socketSingleton.io.emit('newSearch', {name: "t " + thisRequest, url: searchedUrl});
    RecipeParser.getRecipe(searchedUrl, function (err, data) {
        if (err) return res.json(err);
        res.json(data);
    });
}
catch(err){
    console.log(err);
    res.json(err.toString());
}
});
router.get('/recipe/recentSearches', function(req, res, next){
    res.json(recipeCache.recentSearches);
});

module.exports = router;