var S = require('string');
var webParser = require('../modules/webParser');
var baseUrl = "http://www.imdb.com/";

module.exports.get_index = function(req, res, next) {
  res.render('index', { title: 'IMDb Ratings' });
}

module.exports.get = function(req, res, next) {
  webParser.getAndParse(baseUrl + "title/" + req.params.id + '/',
    function (err, window) {
      var title = S(window.$('#overview-top > h1 > span.itemprop').text()).trim().s;
      res.render('chart', { title: 'IMDb Ratings - ' + title, name: title, id: req.params.id });
    },
    function() {
      res.redirect('/');
    }
  )
}

module.exports.search = function(req, res, next) {
  var query = req.query.q;
  webParser.getAndParse(
    baseUrl + "search/title?title=" + query + '&title_type=tv_series',
    function (err, window) {
      var series = window.$('#main > table > tbody > tr:nth-child(2) > td.title > a');
      if(series.length == 0) {
        res.redirect('/');
      } else {
        var regex = /title\/(.+)\//
        var result = series.attr('href').match(regex);
        var id = result[1];
        res.redirect('/' + id);
      }
    },
    function() {
      res.redirect('/');
    }
  );
}