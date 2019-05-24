var express = require('express');
var router = express.Router();
const request = require('request');

/* GET home page. */
router.get('/', function (req, res, next) {

  test('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
  res.json('Express RESTful API');

});

/* GET SINGLE BOOK BY ID */
// https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
router.get('/recipe', function (req, res, next) {
  let recipeUrl = req.query.recipeUrl;
  test(decodeURI(recipeUrl), function (err, data) {
    if(err) return res.json(err);       
    res.json(data);
  })
});

function test(url, callback) {
  request(url, { json: false }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body.url);
  console.log(body.explanation);
  return callback(body, false);
});
}
module.exports = router;