var Show = function(id) {
  this.id = id;
  this.seasons = [];
};

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

module.exports = Show;