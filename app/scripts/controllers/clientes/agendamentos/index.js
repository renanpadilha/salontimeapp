'use strict';
angular.module('salontimeApp')
  .controller('ClientesAgendamentosCtrl', function ($scope, $routeParams, ClientesAgendamentos, Clientes) {
    $scope.agendamentos = {};
    $scope.init = function() {
      Clientes.getAgendamentos(function(error, agendamentos) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.agendamentos = agendamentos;
      });
    };

    $scope.cancelarAgendamento = function(id) {
      Agendamentos.cancel(id, function(error, data) {
        if(error) {
          console.log(error);
          return;
        }
        switch (data.status) {
          case 204:
            alert('Agendamento cancelado com sucesso');
            break;
          case 404:
            alert('Não foi possível localizar o agendamento');
            break;
          default:
            alert('Não foi possível cancelar o agendamento');
        }
        $scope.init();
      });
    };

    $scope.init();
  });
