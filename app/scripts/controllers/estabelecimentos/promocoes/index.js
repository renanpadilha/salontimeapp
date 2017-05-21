'use strict';
angular.module('salontimeApp')
  .controller('PromocoesCtrl', function ($scope, $location, $routeParams, Promocoes, Estabelecimentos, _, $window) {
    $scope.promocoes = {};
    $scope.servicos = [];
    $scope.model = {};

    $scope.init = function() {
      Promocoes.getPromocoes(function(error, promocoes) {
        if(error) return console.warn(error);
        $scope.promocoes = promocoes;
        Estabelecimentos.getServicos(function(error, servicos) {
          if(error) return console.warn(error);
          $scope.servicos = servicos;
        });
      });
    };

    $scope.novo = function() {
      $scope.promocao = {};
    };

    $scope.criar = function() {
      var promo = {
        nome: $scope.promocao.nome,
        id_servico: $scope.model.servicoSelecionado,
        preco: $scope.promocao.preco
      };
      Promocoes.create(promo, function(error, data) {
        if(error) return console.warn(error);
        $scope.promocao = false;
        $scope.init();
      });
    };

    $scope.excluir = function(id) {
      if(!$window.confirm('Essa operação não poderá ser revertida, deseja continuar?')){
        return;
      }
      Promocoes.cancel(id, function(error, data) {
        if(error) return console.warn(error);
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
