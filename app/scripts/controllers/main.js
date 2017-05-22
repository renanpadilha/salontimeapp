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
      Servicos.getEstabelecimentos($scope.servicoSelecionado, function(error, estabelecimentos) {
        if(error) return console.warn(error);
        $scope.estabelecimentos = estabelecimentos;
      });
    };

    $scope.atualizaProfissionais = function() {
      Estabelecimentos.getProfissionaisByServico($scope.estabelecimentoSelecionado, $scope.servicoSelecionado, function(error, profissionais) {
        if(error) return console.warn(error);
        $scope.profissionais = profissionais;
      });
      Estabelecimentos.getPreco($scope.estabelecimentoSelecionado, $scope.servicoSelecionado, function(error, preco) {
        if(error) return console.warn(error);
        Estabelecimentos.getPromocoes($scope.estabelecimentoSelecionado, function(error, promocao) {
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
        var dataLocal = moment($scope.datahora.getTime()).local().format();
        var agendamento = {
          id_estabelecimento: $scope.estabelecimentoSelecionado,
          id_profissional: $scope.profissionalSelecionado,
          id_servico: $scope.servicoSelecionado,
          data: dataLocal
        };
        ClientesAgendamentos.create(agendamento, function(error, data){
          if(error) return console.warn(error);
          $window.alert('Agendamento criado com sucesso');
          $scope.init();
        });
      });
    };

    $scope.init();
});
