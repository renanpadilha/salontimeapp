'use strict';
angular.module('salontimeApp')
  .controller('PromocoesCtrl', function ($scope, $location, $routeParams, Promocoes, Estabelecimentos, _, $window) {
    $scope.promocoes = {};

    $scope.init = function() {
      Promocoes.getPromocoes(function(error, promocoes) {
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
      Promocoes.create($scope.promocao, function(error, data) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.init();
      });
    };

    $scope.excluir = function(id) {
      if(!$window.confirm('Essa operação não poderá ser revertida, deseja continuar?')){
        return;
      }
      Promocoes.cancel(id, function(error, data) {
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
