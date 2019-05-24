var express = require('express');
var router = express.Router();

const RecipeParser = require("./library/recipeParser");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json('Express RESTful API Time:' + new Date(Date.now()).toTimeString());
});

router.get('/recipe', function (req, res, next) {
    try{
    RecipeParser.getRecipe(req.query.recipeUrl, function (err, data) {
        if (err) return res.json(err);
        res.json(data);
    });
}
catch(err){
    console.log(err);
    res.json(err.toString());
}
});

module.exports = router;