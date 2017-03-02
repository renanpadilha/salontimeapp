'use strict';
angular.module('salontimeApp')
  .controller('EstabelecimentosAgendamentosCtrl', function ($scope, $routeParams, EstabelecimentosAgendamentos, Estabelecimentos) {
    $scope.agendamentos = {};
    $scope.init = function() {
      console.log('lul');
      Estabelecimentos.getAgendamentos(function(error, agendamentos) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.agendamentos = agendamentos;
      });
    };

    $scope.cancelarAgendamento = function(id) {
      EstabelecimentosAgendamentos.cancel(id, function(error, data) {
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
