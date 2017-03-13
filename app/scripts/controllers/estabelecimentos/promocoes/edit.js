'use strict';
angular.module('salontimeApp')
  .controller('EstabelecimentosPromocoesEditCtrl', function ($scope, $location, $routeParams, EstabelecimentosPromocoes) {
    $scope.voltar = function() { $location.path('/estabelecimentos/promocoes'); };
    $scope.init = function() {
      EstabelecimentosPromocoes.get($routeParams.id, function(error, promocao) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.promocao = promocao;
      });
    };

    $scope.salvar = function() {
      EstabelecimentosPromocoes.update($scope.promocao, function(error, promocao) {
        if(error) {
          console.log(error);
          return;
        }
      });
    };

    $scope.init();
  });
