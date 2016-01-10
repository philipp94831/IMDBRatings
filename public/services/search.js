app.service('SearchService', function() {
  this.search = function(query) {
    window.location.href = '/search?q=' + query;
  }
});