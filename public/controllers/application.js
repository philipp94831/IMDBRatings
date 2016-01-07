app.controller('ApplicationController', [
'$scope',
'$http',
'$location',
function($scope, $http, $location){
  $scope.search = function() {
    $http.get('/search?q=' + $scope.q)
    .success(function(data) {
      window.location.href = '/' + data;
    });
  };
}]);