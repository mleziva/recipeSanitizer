const express = require('express');
const socketSingleton = require('./library/socketSingleton');
const RecipeParser = require('./library/recipeParser');
const recipeCache = require('./library/recentCache');

const router = express.Router();
/* GET home page. */
router.get('/', (req, res) => {
  res.json(`Express RESTful API Time:${new Date(Date.now()).toTimeString()}`);
});

router.get('/recipe', async (req, res) => {
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
});
router.get('/recipe2', async (req, res, next) => {
  try {
    const searchedUrl = req.query.recipeUrl || 'https://www.allrecipes.com/recipe/245559/fall-infused-mashed-potatoes/?internalSource=staff%20pick&referringId=1540&referringContentType=Recipe%20Hub';
    const data = await RecipeParser.getRecipe2(searchedUrl);
    res.json(data);
  } catch (e) {
    // this will eventually be handled by your error handling middleware
    next(e);
  }
});
router.get('/recipe/recentSearches', (req, res, next) => {
  res.json(recipeCache.recentSearches);
});

module.exports = router;
