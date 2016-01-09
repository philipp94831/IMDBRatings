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
  var a = 0.0;
  var b1 = 0.0;
  var b2 = 0.0;
  var c = 0.0;
  var e = 0.0;
  this.episodes.forEach(function(episode) {
    a += episode.getNumber() * episode.getRating();
    b1 += episode.getNumber();
    b2 += episode.getRating();
    c += episode.getNumber() * episode.getNumber();
    e +=  episode.getRating();
  })
  a *= this.episodes.length;
  var b = b1 * b2;
  c *= this.episodes.length;
  var d = b1 * b1;
  var m = (a - b) / (c - d);
  var f = m * b1;
  var n = (e - f) / this.episodes.length;
  this.trendline = {};
  x1 = this.episodes[0].getNumber();
  x2 = this.episodes[this.episodes.length - 1].getNumber();
  this.trendline[1] = {x: x1, y: m * x1 + n};
  this.trendline[2] = {x: x2, y: m * x2 + n};
}

module.exports = Season;