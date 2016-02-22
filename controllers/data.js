var Show = require('../models/show');
var Season = require('../models/season');
var Episode = require('../models/episode');
var webParser = require('../modules/webParser');
var baseUrl = "http://www.imdb.com/";

module.exports.get = function(req, res, next) {
  var id = req.params.id;
  webParser.getAndParse(
    baseUrl + "title/" + id + '/',
    function (err, window) {
      var show = new Show(id);
      var title = window.$('#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > h1').text().trim();
      show.setTitle(title);
      var rating = window.$('#title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper > div.imdbRating > div.ratingValue > strong > span').text().trim();
      show.setRating(parseFloat(rating));
      webParser.getAndParse(
        baseUrl + "title/" + id + '/episodes',
        function (err, window) {
          var seasons = window.$('#bySeason > option');
          seasons.each(function() {
            sId = parseInt(window.$(this).attr('value'));
            if(sId > 0) {
              var season = new Season(sId);
              show.addSeason(season);
            }
          });
          show.getSeasons().sort(function(a, b) {
            return a.getNumber() - b.getNumber();
          })
          var finish = function() {        
            var number = 1;
            show.clearSeasons();
            show.getSeasons().forEach(function(season) {
              season.getEpisodes().sort(function(a, b) {
                return a.getNumberInSeason() - b.getNumberInSeason();
              })
              season.getEpisodes().forEach(function(episode) {
                episode.setNumber(number++);
              })
              season.calculateTrendline();
            })
            show.calculateTrendline();
            res.json(show);
          }
          parseEpisodes(show, finish, function() {res.redirect('/')});
        },
        function() {
          res.json({});
        }
      );
    },
    function() {
      res.json({});
    }
  );
}

function parseEpisodes(show, callback, error) {
  webParser.getAndParse(
    baseUrl + 'title/' + show.getId() + '/epdate',
    function (err, window) {
      var elements = window.$('#tn15content > table > tbody > tr:not(:nth-child(1))');
      elements.each(function() {
        var regex = /title\/(.+)\//
        var result = window.$(this).find('td:nth-child(2) > a').attr('href').match(regex);
        var episode = new Episode(result[1]);
        regex = /(\d+)\.(\d+)/
        result = window.$(this).find('td:nth-child(1)').text().match(regex);
        if(result !== null) {
          episode.setNumberInSeason(result[2]);
          episode.setTitle(window.$(this).find('td:nth-child(2) > a').text());
          episode.setRating(parseFloat(window.$(this).find('td:nth-child(3)').text()));
          show.getSeasons()[parseInt(result[1]) - 1].addEpisode(episode);
        }
      })
      callback();
    },
    error
  );
}