const express = require('express');
const socketSingleton = require('./library/socketSingleton');
const RecipeParser = require('./library/recipeParser');
const recipeCache = require('./library/recentCache');
const logger = require('./logging/logger');

const router = express.Router();
/* GET home page. */
router.get('/', (req, res) => {
  res.json(`Express RESTful API Time:${new Date(Date.now()).toTimeString()}`);
});

router.get('/recipe', async (req, res, next) => {
  try {
    const searchedUrl = req.query.recipeUrl || 'https://www.allrecipes.com/recipe/245559/fall-infused-mashed-potatoes/?internalSource=staff%20pick&referringId=1540&referringContentType=Recipe%20Hub';
    const recipeObject = await RecipeParser.getRecipe(searchedUrl);
    const recipeContent = recipeObject.recipeContents;
    const recipeName = recipeObject.recipeName;
    const recipeUrl = recipeObject.url;
    const searchHistorObj = { name: recipeName, url: recipeUrl };
    // try to get name from url
    // save search to cache
    recipeCache.addSearch(searchHistorObj);
    socketSingleton.io.emit('newSearch', searchHistorObj);
    res.json(recipeContent);
  } catch (err) {
    console.log(err);
    res.json(err.toString());
  }
  next();
});
router.get('/recipe/recentSearches', (req, res) => {
  res.json(recipeCache.recentSearches);
});

module.exports = router;
