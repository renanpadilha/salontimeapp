'use strict';

/**
 * @ngdoc function
 * @name salontimeApp.controller:EstabelecimentosCtrl
 * @description
 * # EstabelecimentosCtrl
 * Controller of the salontimeApp
 */
angular.module('salontimeApp')
  .controller('EstabelecimentosCtrl', function ($scope, $routeParams, Estabelecimentos) {

    $scope.model = {};
    Estabelecimentos.getEstabelecimentos().then(function(response){
      $scope.estabelecimentos = response.data;
    })
  });
