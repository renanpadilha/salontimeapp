'use strict';
angular.module('salontimeApp')
  .controller('EstabelecimentosProfissionaisCtrl', function ($scope, $routeParams, Estabelecimentos) {
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

    $scope.init();
  });
