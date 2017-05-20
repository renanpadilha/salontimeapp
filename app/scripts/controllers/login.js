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
            $rootScope.$emit('carregaNav', data);
            if(data.tipo === 'E') {
              $location.path('/estabelecimentos/agendamentos');
            } else {
              $location.path('/');
            }
          } else {
            $scope.error = error;
          }
      });
    };
  });
