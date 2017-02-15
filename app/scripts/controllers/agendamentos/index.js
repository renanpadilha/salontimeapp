'use strict';
angular.module('salontimeApp')
  .controller('AgendamentosCtrl', function ($scope, $routeParams, Agendamentos, Clientes) {
    $scope.agendamentos = {};
    $scope.init = function() {
      Clientes.getAgendamentos(function(error, agendamentos) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.agendamentos = agendamentos;
        console.log('Agendamentos, lul', $scope.agendamentos);
      });
    };

    $scope.init();
  });
