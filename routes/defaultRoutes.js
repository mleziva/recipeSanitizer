var express = require('express');
var router = express.Router();
const request = require('request');
const stripHtml = require("string-strip-html");
const HTMLParser = require("node-html-parser");

const hostName = '';
/* GET home page. */
router.get('/', function (req, res, next) {
  res.json('Express RESTful API');
});

// https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
router.get('/recipe', function (req, res, next) {
  let recipeUrl = req.query.recipeUrl;
  determineSite(recipeUrl);
  var printUrl = createPrintUrl(recipeUrl);
  test(decodeURI(printUrl), function (err, data) {
    if(err) return res.json(err);       
    res.json(data);
  })
});

function test(url, callback) {
  request(url, { json: false }, (err, res, body) => {
  if (err) { return console.log(err); }
  var recipe = getPrintableRecipe(body, '.recipe-print__container');
  return callback(recipe, false);
});
}
function determineSite(url){
  var parsedUrl = new URL(url);
  this.hostName = parsedUrl.hostname;
};
function createPrintUrl(url){
  var printUrl = '';
  if(this.hostName.includes('allrecipes.com')){
    var lastSlash = nthIndex(url,'/',6)
    var mainUrl = url.substr(0, lastSlash)
    printUrl = mainUrl + '/print';
  }
  //allrecieps pattern: https://www.allrecipes.com/recipe/245559/fall-infused-mashed-potatoes/print/
  //hostname/recipe/{id}/{name}/print
  return printUrl;
};
function getPrintableRecipe(content, selector){
  var root = HTMLParser.parse(content);
  var recipe = root.querySelector(selector);
  return recipe.toString();
};
function nthIndex(str, pat, n){
  var L= str.length, i= -1;
  while(n-- && i++<L){
      i= str.indexOf(pat, i);
      if (i < 0) break;
  }
  return i;
}


module.exports = router;