'use strict';
angular.module('salontimeApp')
  .controller('MainCtrl', function ($scope, $routeParams, $http, ClientesAgendamentos, Categorias, Servicos, Estabelecimentos, Blacklist, $window, Favoritos) {
    const API_URL = 'https://salontime.herokuapp.com/api/v1';
    $scope.init = function() {
      if(!$scope.agendamento) {
        $scope.agendamento = {};
      }
    };

    Categorias.all(function(error, categorias) {
      if(error) return console.warn(error);
      $scope.categorias = categorias;
    });

    $scope.atualizaServicos = function() {
      Categorias.getServicos($scope.categoriaSelecionada, function(error, servicos) {
        if(error) return console.warn(error);
        $scope.servicos = servicos;
      });
    };

    $scope.atualizaEstabelecimentos = function() {
      Servicos.getEstabelecimentos($scope.servicoSelecionado.id, function(error, estabelecimentos) {
        if(error) return console.warn(error);
        $scope.estabelecimentos = estabelecimentos;
      });
    };

    $scope.atualizaProfissionais = function() {
      Estabelecimentos.getProfissionaisByServico($scope.estabelecimentoSelecionado.id, $scope.servicoSelecionado.id, function(error, profissionais) {
        if(error) return console.warn(error);
        $scope.profissionais = profissionais;
      });
      Estabelecimentos.getPreco($scope.estabelecimentoSelecionado.id, $scope.servicoSelecionado.id, function(error, preco) {
        if(error) return console.warn(error);
        Estabelecimentos.getPromocoes($scope.estabelecimentoSelecionado.id, function(error, promocao) {
          if(error) return console.warn(error);
          if(promocao && promocao.servico === $scope.servicos[0].nome) {
            $scope.promocao = promocao.preco;
            $scope.preco = $scope.promocao;
          } else {
            $scope.preco = preco.preco;
          }
        });
      });
    };

    $scope.agendar = function() {
      //@TODO fazer get no banco pra saber se existe um horário igual marcado
      Blacklist.getByCliente(function(error, blacklist) {
        if(error) return console.warn(error);
        var blacklist = blacklist;
        if(blacklist.length >= 2) {
          return $window.alert('Você não pode agendar nesse estabelecimento porque se atrasou/faltou ao compromisso');
        }
        var dataLocal = moment($scope.model.datahora.getTime()).local().format();
        var agendamento = {
          id_estabelecimento: $scope.estabelecimentoSelecionado.id,
          id_profissional: $scope.profissionalSelecionado.id,
          id_servico: $scope.servicoSelecionado.id,
          data: dataLocal
        };
        ClientesAgendamentos.create(agendamento, function(error, data){
          if(error) return console.warn(error);
          var email = {
            subject: 'Agendamento Realizado!',
            message: 'Seu agendamento no estabelecimento ' + $scope.estabelecimentoSelecionado.nome + ' está marcado para o dia ' + $scope.model.datahora
            + ' para realização do serviço ' + $scope.servicoSelecionado.nome + ' com ' + $scope.profissionalSelecionado.nome
          };
          ClientesAgendamentos.sendEmail(email, function(error, data) {
            if(error) console.warn(error);
          });
          $window.alert('Agendamento criado com sucesso');
          $scope.init();
        });
      });
    };

    $scope.init();
});
