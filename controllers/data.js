var jsdom = require("jsdom");
var Show = require('../models/show');
var Season = require('../models/season');
var Episode = require('../models/episode');
var S = require('string');
var baseUrl = "http://www.imdb.com/";

module.exports.get = function(req, res, next) {
  var id = req.params.id;
  jsdom.env(
    baseUrl + "title/" + id + '/',
    ["http://code.jquery.com/jquery.js"],
    function (err, window) {
      var show = new Show(id);
      var title = S(window.$('h1[itemprop="name"]').text()).trim().s;
      if(window.$('h1[itemprop="name"]') ===undefined) {
        console.log(window.$('body').prop('outerHTML'));
      }
      show.setTitle(title);
      var seasons = window.$('#title-episode-widget > div > div:nth-child(4) > a');
      var finish = function(season) {
        show.addSeason(season);
        if(seasons.length == show.getSeasons().length) {
          show.getSeasons().sort(function(a, b) {
            return a.getNumber() - b.getNumber();
          })
          var number = 1;
          show.getSeasons().forEach(function(season) {
            season.getEpisodes().sort(function(a, b) {
              return a.getNumberInSeason() - b.getNumberInSeason();
            })
            season.getEpisodes().forEach(function(episode) {
              episode.setNumber(number++);
            })
          })
          res.json(show);
        }
      }
      seasons.each(function() {
        parseSeasons(window.$(this), finish);
      });
    }
  );
}

function parseSeasons(element, callback) {
  var season = new Season(parseInt(element.text()));
  jsdom.env(
    baseUrl + element.attr('href'),
    ["http://code.jquery.com/jquery.js"],
    function (err, window) {
      var episodes = window.$('#episodes_content > div.clear > div.list.detail.eplist > div > div.info > strong > a');
      var finish = function(episode) {
        season.addEpisode(episode);
        if(episodes.length == season.getEpisodes().length) {
          callback(season);
        }
      }
      var i = 1;
      episodes.each(function() {
        parseEpisodes(window.$(this), finish, i++);
      });
    }
  );
}

function parseEpisodes(element, callback, number) {  
  var regex = /title\/(.+)\//
  var result = element.attr('href').match(regex);
  var episode = new Episode(result[1]);
  episode.setNumberInSeason(number);
  episode.setTitle(element.text());
  jsdom.env(
    baseUrl + element.attr('href'),
    ["http://code.jquery.com/jquery.js"],
    function (err, window) {
      episode.setRating(parseFloat(window.$('span[itemprop="ratingValue"]').text()));
      callback(episode);
    }
  );
}