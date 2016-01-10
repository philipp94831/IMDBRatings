var statistics = require('../modules/statistics');

var Season = function(number) {
  this.number = number;
  this.episodes = [];
};

Season.prototype.getEpisodes = function() {
  return this.episodes;
}

Season.prototype.getNumber = function() {
  return this.number;
}

Season.prototype.addEpisode = function(episode) {
  this.episodes.push(episode);
}

Season.prototype.calculateTrendline = function() {
  var values = [];
  this.episodes.forEach(function(episode) {
    values.push({x: episode.getNumber(), y: episode.getRating()});
  })
  this.trendline = statistics.calculateTrendline(values);
}

module.exports = Season;