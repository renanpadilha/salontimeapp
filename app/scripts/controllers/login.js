'use strict';

/**
 * @ngdoc function
 * @name zetaWebClient.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the zetaWebClient
 */
angular.module('salontimeApp')
  .controller('LoginCtrl', function($scope, $rootScope, $location, Authentication) {
    $scope.login = function() {
      Authentication.login($scope.username, $scope.password, function(error, data) {
          if (!error) {
            $location.path('/');
          } else {
            console.log(data);
            console.log(error);
            $scope.error = error;
          }
      });
    };
  });
