app.controller('SearchController', 
function($scope, SearchService){
  $scope.search = SearchService.search;
});