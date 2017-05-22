'use strict';
angular.module('salontimeApp')
  .controller('ClientesFavoritosCtrl', function ($scope, $routeParams, Favoritos, Clientes, $window, Estabelecimentos) {
    $scope.favoritos = [];
    $scope.estabelecimentos = [];
    $scope.model = {};

    $scope.init = function() {
      $scope.favorito = false;
      Favoritos.get(function(error, favoritos) {
        if(error) return console.warn(error);
        $scope.favoritos = favoritos;
      });
      Favoritos.getEstabelecimentos(function(error, estabelecimentos) {
        if(error) return console.warn(error);
        $scope.estabelecimentos = estabelecimentos;
      });
    };

    $scope.novo = function() {
      $scope.favorito = {};
    };

    $scope.cancelar = function() {
      $scope.favorito = false;
    };

    $scope.criar = function() {
      Favoritos.create($scope.model.estabelecimentoFavorito, function(error, data) {
        if(error) return console.warn(error);
        $window.alert('Favorito criado');
        $scope.init();
      });
    };

    $scope.excluir = function(id) {
      if(!$window.confirm('Essa operação não poderá ser revertida, deseja continuar?')){
        return;
      }
      Favoritos.delete(id, function(error, data) {
        if(error) return console.warn(error);
        $scope.init();
      });
    };

    $scope.openModal = function(model) {
      $scope.model = {};
      $scope.model = model;
      Favoritos.getServicos($scope.model.estabelecimento, function(error, servicos) {
        if(error) return console.warn(error);
        $scope.model.servicos = servicos;
      });
    };

    $scope.atualizarPreco = function() {
      Estabelecimentos.getPreco($scope.model.estabelecimento, $scope.servico.id_servico, function(error, preco) {
        if(error) return console.warn(error);
        Favoritos.getPromocoes($scope.model.estabelecimento, function(error, promocao) {
          if(error) return console.warn(error);
          console.log($scope.servico, promocao);
          if(promocao && promocao.servico === $scope.servico.nomeservico) {
            $scope.model.promocao = promocao.preco;
            $scope.model.preco = $scope.model.promocao;
          } else {
            $scope.model.preco = preco.preco;
          }
        });
      });
    };



    $scope.agendar = function() {

    };

    $scope.init();
  });
