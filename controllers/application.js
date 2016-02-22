var request = require('request');
var webParser = require('../modules/webParser');
var baseUrl = "http://www.imdb.com/";

module.exports.get_index = function(req, res, next) {
  message = req.session.message;
  req.session.message = undefined;
  res.render('index', { title: 'Home', message: message });
}

module.exports.get_top = function(req, res, next) {
  webParser.getAndParse(baseUrl + "search/title?num_votes=5000,&sort=user_rating,desc&title_type=tv_series",
    function (err, window) {
      var elements = window.$('#main > table > tbody > tr.detailed');
      shows = [];
      elements.each(function() {
        show = {};
        show.rank = window.$(this).find('td.number').text().match(/(\d+)/)[1];
        show.title = window.$(this).find('td.title > a').text().trim();
        var regex = /title\/(.+)\//
        var result = window.$(this).find('td.title > a').attr('href').match(regex);
        show.id = result[1];
        show.rating = window.$(this).find('td.title > div > div > span.rating-rating > span.value').text().trim();
        src = window.$(this).find('td.image > a > img').attr('src');
        show.img = src;
        result = src.match(/(.*\..*\._)S[XY]\d+(.*CR)(\d+\.?\d*).*\.(.*)/);
        if(src !== 'http://i.media-imdb.com/images/SFa26455c07afc3c94f52e95de50d5d814/realm/tv_series.gif') {
          show.img = result[1] + 'SY150' + result[2] + (parseInt(result[3]) * 150 / 74) + ',0,109,150_.' + result[4];
        }
        show.outline = window.$(this).find('td.title > span.outline').text().trim();
        show.actors = [];
        window.$(this).find('td.title > span.credit > a').each(function() {
          show.actors.push(window.$(this).text().trim());
        });
        shows.push(show);
      })
      message = req.session.message;
      req.session.message = undefined;
      res.render('top', { title: 'Top TV Shows', shows: shows, message: message });
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
      var type = window.$('#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > div > a:last-child').text().trim();
      if(type.startsWith('TV Series')) {
        var title = window.$('#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > h1').text().trim();
        res.locals.name = title;
        res.locals.id = req.params.id;
        rawTime = window.$('#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > div.subtext > a:last-child').text();
        matches = rawTime.match(/\((\d+.*)\)/);
        if(matches && matches.length > 1) {
          res.locals.time = matches[1];
        }
        res.locals.img = window.$('#title-overview-widget > div.vital > div.slate_wrapper > div.poster > a > img').attr('src');
        res.locals.summary = window.$('#title-overview-widget > div.plot_summary_wrapper > div.plot_summary > div.summary_text').text().trim();
        res.locals.rating = window.$('#title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper > div.imdbRating > div.ratingValue > strong > span').text().trim();
        res.locals.users = window.$('#title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper > div.imdbRating > a > span').text().trim();
        res.locals.actors = [];
        window.$('#title-overview-widget > div.plot_summary_wrapper > div.plot_summary > div:nth-child(3) > span > a > span').each(function() {
          res.locals.actors.push(window.$(this).text().trim());
        });
        message = req.session.message;
        req.session.message = undefined;
        res.render('chart', { title: title, message: message });
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