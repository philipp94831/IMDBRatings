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
      console.log(title);
      if(title == "") {
        console.log(window.$('#title-overview-widget').prop('outerHTML'));
      }
      show.setTitle(title);
      var seasons = window.$('#title-episode-widget > div > div:nth-child(4) > a');
      seasons.each(function() {
        var season = new Season(parseInt(window.$(this).text()));
        show.addSeason(season);
      });
      show.getSeasons().sort(function(a, b) {
        return a.getNumber() - b.getNumber();
      })
      var finish = function() {        
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
      parseEpisodes(show, finish);
    }
  );
}

function parseEpisodes(show, callback) {
  jsdom.env(
    baseUrl + 'title/' + show.getId() + '/epdate',
    ["http://code.jquery.com/jquery.js"],
    function (err, window) {
      var elements = window.$('#tn15content > table > tbody > tr:not(:nth-child(1))');
      elements.each(function() {
        var regex = /title\/(.+)\//
        var result = window.$(this).find('td:nth-child(2) > a').attr('href').match(regex);
        var episode = new Episode(result[1]);
        regex = /(\d+)\.(\d+)/
        result = window.$(this).find('td:nth-child(1)').text().match(regex);
        episode.setNumberInSeason(result[2]);
        episode.setTitle(window.$(this).find('td:nth-child(2) > a').text());
        episode.setRating(parseFloat(window.$(this).find('td:nth-child(3)').text()));
        show.getSeasons()[parseInt(result[1]) - 1].addEpisode(episode);
      })
      callback();
    }
  );
}