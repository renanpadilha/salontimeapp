'use strict';
angular.module('salontimeApp')
  .controller('EstabelecimentosProfissionaisEditCtrl', function ($scope, $location, $routeParams, Estabelecimentos, Profissionais) {
    $scope.voltar = function() { $location.path('/estabelecimentos/profissionais'); };
    $scope.init = function() {
      Profissionais.get($routeParams.id, function(error, profissional) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.profissional = profissional;
      });
    };

    $scope.salvar = function() {
      Profissionais.update($scope.profissional, function(error, profissional) {
        if(error) return console.warn(error);
        $scope.voltar();
      });
    };

    $scope.init();
  });
