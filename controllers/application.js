var jsdom = require("jsdom");
var S = require('string');
var request = require('request');
var baseUrl = "http://www.imdb.com/";

module.exports.get_index = function(req, res, next) {
  res.render('index', { title: 'IMDb Ratings' });
}

module.exports.get = function(req, res, next) {
  request(baseUrl + "title/" + req.params.id + '/', function(err, response, body) {
    if(!err && response.statusCode == 200) {
      jsdom.env(
        body,
        ["http://code.jquery.com/jquery.js"],
        function (err, window) {
          var title = S(window.$('#overview-top > h1 > span.itemprop').text()).trim().s;
          res.render('chart', { title: 'IMDb Ratings - ' + title, name: title, id: req.params.id });
        }
      );
    } else {
      res.redirect('/');
    }
  }
)}

module.exports.search = function(req, res, next) {
  var query = req.query.q;
  console.log("query: " + query);
  jsdom.env(
    baseUrl + "search/title?title=" + query + '&title_type=tv_series',
    ["http://code.jquery.com/jquery.js"],
    function (err, window) {
      var series = window.$('#main > table > tbody > tr:nth-child(2) > td.title > a');
      if(series.length == 0) {
        res.redirect('/');
      } else {
        var regex = /title\/(.+)\//
        var result = series.attr('href').match(regex);
        var id = result[1];
        console.log("ID: "+  id);
        res.redirect('/' + id);
      }
    }
  );
}