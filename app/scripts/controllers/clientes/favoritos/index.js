'use strict';
angular.module('salontimeApp')
  .controller('ClientesFavoritosCtrl', function ($scope, $routeParams, Favoritos, Clientes) {
    $scope.favoritos = [];
    $scope.init = function() {
      Favoritos.get(function(error, favoritos) {
        if(error) return console.warn(error);
        $scope.favoritos = favoritos;
      });
    };
    // Criar change disparando a alteração da flag false e true com checkbox.

    $scope.init();
  });
