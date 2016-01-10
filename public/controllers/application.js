app.controller('ApplicationController', 
function($scope, SearchService){
  $scope.search = SearchService.search;
});