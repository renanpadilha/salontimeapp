'use strict';
angular.module('salontimeApp')
  .controller('ServicosEditCtrl', function ($scope, $location, $routeParams, Servicos) {
    $scope.voltar = function() { $location.path('/estabelecimentos/servicos'); };

    $scope.init = function() {
      Servicos.get($routeParams.id, function(error, servico) {
        if(error) return console.warn(error);
        $scope.servico = servico;
        console.log(servico);
      });
    };

    $scope.salvar = function() {
      Servicos.update($scope.servico, function(error, servico) {
        if(error) return console.warn(error);
        console.log('ae', $scope.servico);
        $scope.init();
      });
    };

    $scope.init();
  });
