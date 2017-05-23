'use strict';
angular.module('salontimeApp')
  .controller('EstabelecimentosAgendamentosCtrl', function ($scope, $routeParams, EstabelecimentosAgendamentos, Estabelecimentos, _, $window, Blacklist) {
    $scope.agendamentos = [];
    $scope.init = function() {
      EstabelecimentosAgendamentos.getRating(function(error, rate) {
        if(error) return console.warn(error);
        $scope.rate = rate;
      });
      Estabelecimentos.getAgendamentos(function(error, agendamentos) {
        if(error) return console.warn(error);
        $scope.agendamentos = agendamentos;
      });
    };

    $scope.openModal = function(agendamento) {
      $scope.model = {};
      $scope.model.agendamento = agendamento;
      EstabelecimentosAgendamentos.getCliente($scope.model.agendamento.idcliente, function(error, cliente) {
        if(error) return console.warn(error);
        $scope.model.email = cliente.email;
      });
    };

    $scope.cancelarAgendamento = function(id) {
      var email = {
        email: $scope.model.email,
        subject: 'Cancelamento',
        message: 'Seu agendamento do dia ' + $scope.model.agendamento.dataagendamento
        + ' foi cancelado pelo motivo: ' + $scope.model.motivo
      };
      EstabelecimentosAgendamentos.sendEmail(email, function(error, msg) {
        if(error) return console.warn(error);
        EstabelecimentosAgendamentos.cancel(id, function(error, data) {
          if(error) return console.warn(error);
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
      });
    };

    $scope.concluirAgendamento = function(agendamento) {
      var confirm = $window.confirm('Deseja concluir o atendimento?');
      if(confirm === true) {
        EstabelecimentosAgendamentos.conclude(agendamento, function(error, agendamento) {
          if(error) return console.warn(error);
          alert('Agendamento concluído com sucesso!');
          $scope.init();
        });
      }
    };

    $scope.enviarParaBlacklist = function(agendamento) {
      Blacklist.create(agendamento.idcliente, function(error, data) {
        if(error) return console.warn(error);
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
