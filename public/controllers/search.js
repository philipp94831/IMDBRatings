app.controller('SearchController', [
'$scope',
function($scope){
  $scope.search = function() {
    window.location.href = '/search?q=' + $scope.q;
  };
}]);