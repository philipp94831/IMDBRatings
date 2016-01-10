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

Show.prototype.calculateTrendline = function() {
  var a = 0.0;
  var b1 = 0.0;
  var b2 = 0.0;
  var c = 0.0;
  var e = 0.0;
  var total = 0;
  this.seasons.forEach(function(season) {
    season.getEpisodes().forEach(function(episode) {
      if(!isNaN(episode.getRating())) {
        a += episode.getNumber() * episode.getRating();
        b1 += episode.getNumber();
        b2 += episode.getRating();
        c += episode.getNumber() * episode.getNumber();
        e +=  episode.getRating();
        total++;
      }
    })
  });
  a *= total;
  var b = b1 * b2;
  c *= total;
  var d = b1 * b1;
  var m = (a - b) / (c - d);
  var f = m * b1;
  var n = (e - f) / total;
  this.trendline = {};
  x1 = this.seasons[0].getEpisodes()[0].getNumber();
  lastSeason = this.seasons[this.seasons.length - 1];
  x2 = lastSeason.getEpisodes()[lastSeason.getEpisodes().length - 1].getNumber();
  this.trendline[1] = {x: x1, y: m * x1 + n};
  this.trendline[2] = {x: x2, y: m * x2 + n};
}

module.exports = Show;