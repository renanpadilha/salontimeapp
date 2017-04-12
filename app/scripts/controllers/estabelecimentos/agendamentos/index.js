'use strict';
angular.module('salontimeApp')
  .controller('EstabelecimentosAgendamentosCtrl', function ($scope, $routeParams, EstabelecimentosAgendamentos, Estabelecimentos, _, $window, Blacklist) {
    $scope.agendamentos = [];
    $scope.init = function() {
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

    $scope.concluirAgendamento = function(agendamento) {
      var confirm = $window.confirm('Deseja concluir o atendimento?');
      if(confirm === true) {
        EstabelecimentosAgendamentos.conclude(agendamento, function(error, agendamento) {
          if(error) {
            console.log(error);
            return;
          }
          alert('Agendamento concluído com sucesso!');
          console.log('lul', agendamento);
          $scope.init();
        });
      }
    };

    $scope.enviarParaBlacklist = function(agendamento) {
      Blacklist.create(agendamento.idCliente, function(error, data) {
        if(error) {
          console.warn(error);
          return;
        }
        $window.alert('Cliente enviado para blacklist\nPara que o cliente seja bloqueado, são necessárias 2 inserções');
      });
    };

    $scope.checkDay = function(agendamento) {
      var agora = moment.utc(new Date()).local().format();
      var dataAgend = moment.utc(agendamento.dataagendamento).local().format();
      if(agora > dataAgend) {
        return false;
      } else {
        return true;
      }
    };

    $scope.init();
  });
