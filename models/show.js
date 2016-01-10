var statistics = require('../modules/statistics');

var Show = function(id) {
  this.id = id;
  this.seasons = [];
};

Show.prototype.getId = function() {
  return this.id;
}

Show.prototype.setTitle = function(title) {
  this.title = title;
}

Show.prototype.getTitle = function() {
  return this.title;
}

Show.prototype.getSeasons = function() {
  return this.seasons;
}

Show.prototype.addSeason = function(season) {
  this.seasons.push(season);
}

Show.prototype.clearSeasons = function() {
  for(i = this.seasons.length - 1; i >= 0; i--) {
    if(this.seasons[i].getEpisodes().length == 0) {
      this.seasons.splice(i, 1);
    }
  }
}

Show.prototype.calculateTrendline = function() {
  var values = [];
  this.seasons.forEach(function(season) {
    season.getEpisodes().forEach(function(episode) {
      values.push({x: episode.getNumber(), y: episode.getRating()});
    })
  });
  this.trendline = statistics.calculateTrendline(values);
}

module.exports = Show;