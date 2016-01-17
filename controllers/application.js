var request = require('request');
var webParser = require('../modules/webParser');
var baseUrl = "http://www.imdb.com/";

module.exports.get_index = function(req, res, next) {
  message = req.session.message;
  req.session.message = undefined;
  res.render('index', { message: message });
}

module.exports.get_top = function(req, res, next) {
  webParser.getAndParse(baseUrl + "search/title?num_votes=5000,&sort=user_rating,desc&title_type=tv_series",
    function (err, window) {
      var elements = window.$('#main > table > tbody > tr.detailed');
      shows = [];
      elements.each(function() {
        show = {};
        show.title = window.$(this).find('td.title > a').text().trim();
        var regex = /title\/(.+)\//
        var result = window.$(this).find('td.title > a').attr('href').match(regex);
        show.id = result[1];
        show.rating = window.$(this).find('td.title > div > div > span.rating-rating > span.value').text().trim();
        src = window.$(this).find('td.image > a > img').attr('src');
        if(src.match(/.*jpg/)) {
          result = src.match(/(\.[^\.]+)\.jpg/);
          show.img = src.replace(result[1], '');
        } else if(src.match(/.*png/)) {
          result = src.match(/(\.[^\.]+)\.png/);
          show.img = src.replace(result[1], '');
        } else {
          show.img = src;
        }
        show.outline = window.$(this).find('td.title > span.outline').text().trim();
        show.actors = [];
        window.$(this).find('td.title > span.credit > a').each(function() {
          show.actors.push(window.$(this).text().trim());
        });
        shows.push(show);
      })
      res.render('top', { shows: shows });
    },
    function() {
      req.session.message = "Error loading Top TV Shows";
      res.redirect('/');
    }
  )
}

module.exports.get = function(req, res, next) {
  webParser.getAndParse(baseUrl + "title/" + req.params.id + '/',
    function (err, window) {
      var type = window.$('#overview-top > div.infobar').text().trim();
      if(type.startsWith('TV Series')) {
        var title = window.$('#overview-top > h1 > span.itemprop').text().trim();
        res.locals.name = title;
        res.locals.id = req.params.id;
        res.locals.time = window.$('#overview-top > h1 > span.nobr').text();
        res.locals.img = window.$('#img_primary > div.image > a > img').attr('src');
        res.locals.summary = window.$('#overview-top > p:nth-child(6)').text().trim();
        res.locals.rating = window.$('#overview-top > div.star-box.giga-star > div.star-box-details > strong > span').text().trim();
        res.locals.users = window.$('#overview-top > div.star-box.giga-star > div.star-box-details > a:nth-child(3) > span').text().trim();
        res.locals.actors = [];
        window.$('#overview-top > div:nth-child(9) > a > span').each(function() {
          res.locals.actors.push(window.$(this).text().trim());
        });
        res.render('chart', { title: title });
      } else {
        req.session.message = "Title is not a series";
        res.redirect('/');
      }
    },
    function() {
      req.session.message = "Series not found";
      res.redirect('/');
    }
  )
}

module.exports.search = function(req, res, next) {
  var query = req.query.q;
  if(query.length == 0) {
    req.session.message = "Please submit a valid query";
    res.redirect('/');
  } else if(query.match(/tt\d{7}/)) {
    request(baseUrl + '/title/' + query, function(err, response, body) {
      if(!err && response.statusCode == 200) {
        res.redirect('/' + query);
      } else {
        req.session.message = "Series not found";
        res.redirect('/');
      }
    })
  } else {
    webParser.getAndParse(
      baseUrl + "search/title?title=" + query + '&title_type=tv_series',
      function (err, window) {
        var series = window.$('#main > table > tbody > tr:nth-child(2) > td.title > a');
        if(series.length == 0) {
          req.session.message = "No results";
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
}