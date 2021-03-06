'use strict';
angular.module('salontimeApp')
  .controller('EstabelecimentosProfissionaisCtrl', function ($scope, $location, $routeParams, Estabelecimentos, Profissionais, $window) {
    $scope.profissionais = {};

    $scope.init = function() {
      Estabelecimentos.getProfissionais(function(error, profissionais) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.profissionais = profissionais;
      });
    };

    $scope.novo = function() {
      $scope.profissional = {};
    };

    $scope.criar = function() {
      Profissionais.create($scope.profissional, function(error, data) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.init();
      });
    };

    $scope.excluir = function(id) {
      if(!$window.confirm('Essa operação não poderá ser revertida, deseja continuar?')) {
        return;
      }
      Profissionais.excluir(id, function(error, data) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.init();
      });
    };

    $scope.cancelar = function() {
      $scope.profissional = false;
    };

    $scope.editar = function(id) {
      $location.path('/estabelecimentos/profissionais/' + id);
    };

    $scope.init();
  });
