'use strict';
angular.module('salontimeApp')
  .controller('MainCtrl', function ($scope, $routeParams, $http, ClientesAgendamentos, Categorias, Servicos, Estabelecimentos, Blacklist) {
    const API_URL = 'https://salontime.herokuapp.com/api/v1';
    $scope.init = function() {
      if(!$scope.agendamento) {
        $scope.agendamento = {};
      }
    };

    Categorias.all(function(error, categorias) {
      if(error) {
        console.log(error);
        return;
      }
      $scope.categorias = categorias;
      console.log('Categorias', $scope.categorias);
    });

    $scope.atualizaServicos = function() {
      Categorias.getServicos($scope.categoriaSelecionada, function(error, servicos) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.servicos = servicos;
        console.log('Serviços', $scope.servicos);
      });
    };

    $scope.atualizaEstabelecimentos = function() {
      Servicos.getEstabelecimentos($scope.servicoSelecionado, function(error, estabelecimentos) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.estabelecimentos = estabelecimentos;
      });
    };

    $scope.atualizaProfissionais = function() {
      Estabelecimentos.getProfissionaisByServico($scope.estabelecimentoSelecionado, $scope.servicoSelecionado, function(error, profissionais) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.profissionais = profissionais;
        console.log('Profissionais', $scope.profissionais);
      });
      Estabelecimentos.getPreco($scope.estabelecimentoSelecionado, $scope.servicoSelecionado, function(error, preco) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.preco = preco.preco;
      });
    };

    $scope.agendar = function() {
      //@TODO fazer get no banco pra saber se existe um horário igual marcado
      Blacklist.getByCliente(function(error, blacklist) {
        if(error) {
          console.warn(error);
        }
        var blacklist = blacklist;
        if(blacklist.length >= 2) {
          $window.alert('Você não pode agendar nesse estabelecimento porque se atrasou/faltou ao compromisso');
          return;
        }
        var dataLocal = moment($scope.datahora.getTime()).local().format();
        var agendamento = {
          id_estabelecimento: $scope.estabelecimentoSelecionado,
          id_profissional: $scope.profissionalSelecionado,
          id_servico: $scope.servicoSelecionado,
          data: dataLocal
        };
        ClientesAgendamentos.create(agendamento, function(error, data){
          if(error) {
            console.log(error);
            return;
          }
          console.log('Dados do agendamento', data);
        });
      });
    };

    $scope.init();
});
