'use strict';
angular.module('salontimeApp')
  .controller('PromocoesEditCtrl', function ($scope, $location, $routeParams, Promocoes) {
    $scope.voltar = function() { $location.path('/estabelecimentos/promocoes'); };
    $scope.init = function() {
      Promocoes.get($routeParams.id, function(error, promocao) {
        if(error) {
          console.log(error);
          return;
        }
        console.log(promocao);
        $scope.promocao = promocao;
      });
    };

    $scope.salvar = function() {
      delete $scope.promocao.servico;
      Promocoes.update($scope.promocao, function(error, promocao) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.init();
      });
    };

    $scope.init();
  });
