'use strict';

/**
 * @ngdoc function
 * @name zetaWebClient.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the zetaWebClient
 */
angular.module('salontimeApp')
  .controller('NavbarCtrl', function($scope, Authentication, $rootScope, $location) {
    $scope.init = function() {
      $scope.isNavCollapsed = true;
      $scope.isCollapsed = false;
      $scope.isCollapsedHorizontal = false;
      Authentication.getLoggedInUser(function(data) {
        $scope.user = data;
      });
      $scope.logado = Authentication.isLoggedIn();
    };

    $scope.sair = function() {
      Authentication.logout(function() {
        $location.path('/login');
        $scope.logado = false;
      });
    };

    $rootScope.$on('carregaNav', function() {
      $scope.logado = Authentication.isLoggedIn();
      $scope.init();
    });

    $scope.init();
  });
