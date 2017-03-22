'use strict';
angular.module('salontimeApp')
  .controller('ClientesAgendamentosCtrl', function ($scope, $routeParams, ClientesAgendamentos, Clientes) {
    $scope.agendamentos = [];
    $scope.init = function() {
      Clientes.getAgendamentos(function(error, agendamentos) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.agendamentos = agendamentos;
        console.log(agendamentos);
      });
    };

    $scope.openModal = function(agendamento) {
      $scope.model = {};
      $scope.model.agendamento = agendamento;
    };

    $scope.qualificarAgendamento = function(object) {
      var agendamento = {
        id: object.id,
        rate: object.rate
      };
      ClientesAgendamentos.qualify(agendamento, function(error, agendamento) {
        if(error) {
          console.log(error);
          return;
        }
        $('.modal').modal('hide');
        $scope.init();
      });
    };

    $scope.cancelarAgendamento = function(id) {
      ClientesAgendamentos.cancel(id, function(error, data) {
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
