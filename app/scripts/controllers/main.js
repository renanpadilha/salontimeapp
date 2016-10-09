'use strict';

/**
 * @ngdoc function
 * @name salontimeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the salontimeApp
 */
angular.module('salontimeApp')
  .controller('MainCtrl', function ($scope, $routeParams, Main) {
    $scope.agendamento = {};
    Main.getServicos().then(function(response){
        $scope.servicos = response.data;
    });

    Main.getEstabelecimentoByIdService({id: $scope.servicoSelecionado}).then(function(response){
        $scope.estabelecimentos = response.data;
        console.log('LOG', $scope.estabelecimentos);
    });

    console.log('LOG', $scope.estabelecimentos);
    console.log($scope.servicoSelecionado);

  });
