var Episode = function(id) {
  this.id = id;
};

Episode.prototype.setTitle = function(title) {
  this.title = title;
}

Episode.prototype.getTitle = function() {
  return this.title;
}

Episode.prototype.setRating = function(rating) {
  this.rating = rating;
}

Episode.prototype.getRating = function() {
  return this.rating;
}

Episode.prototype.setNumberInSeason = function(number) {
  this.numberInSeason = number;
}

Episode.prototype.getNumberInSeason = function() {
  return this.numberInSeason;
}

Episode.prototype.setNumber = function(number) {
  this.number = number;
}

Episode.prototype.getNumber = function() {
  return this.number;
}

module.exports = Episode;