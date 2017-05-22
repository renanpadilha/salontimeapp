'use strict';
angular.module('salontimeApp')
  .controller('ClientesFavoritosCtrl', function ($scope, $routeParams, Favoritos, Clientes, $window) {
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
      console.log($scope.model);
    };

    $scope.agendar = function() {

    };

    $scope.init();
  });
