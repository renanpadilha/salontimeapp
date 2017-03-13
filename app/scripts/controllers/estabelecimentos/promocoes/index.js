'use strict';
angular.module('salontimeApp')
  .controller('EstabelecimentosPromocoesCtrl', function ($scope, $location, $routeParams, EstabelecimentosPromocoes) {
    $scope.promocoes = {};

    $scope.init = function() {
      EstabelecimentosPromocoes.getPromocoes(function(error, promocoes) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.promocoes = promocoes;
      });
    };

    $scope.novo = function() {
      $scope.promocao = {};
    };

    $scope.criar = function() {
      EstabelecimentosPromocoes.create($scope.promocoes, function(error, data) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.init();
      });
    };

    $scope.cancelar = function() {
      $scope.promocoes = false;
    };

    $scope.editar = function(id) {
      $location.path('/estabelecimentos/promocoes/' + id);
    };

    $scope.init();
  });
