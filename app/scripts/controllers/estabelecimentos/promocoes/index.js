'use strict';
angular.module('salontimeApp')
  .controller('EstabelecimentosPromocoesCtrl', function ($scope, $location, $routeParams, EstabelecimentosPromocoes, Estabelecimentos, _) {
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
      Estabelecimentos.getServicos(function(error, batata) {
        if (error) {
          console.log(error);
        }
        $scope.promocao = {};
        _.extend($scope.promocao, {
          servicos: batata
        });
      });
    };

    $scope.criar = function() {
      EstabelecimentosPromocoes.create($scope.promocao, function(error, data) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.init();
      });
    };

    $scope.excluir = function(id) {
      EstabelecimentosPromocoes.cancel(id, function(error, data) {
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
