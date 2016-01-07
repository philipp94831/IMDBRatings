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

module.exports = Season;