'use strict';
angular.module('salontimeApp')
  .controller('ClientesFavoritosCtrl', function ($scope, $routeParams, Favoritos, Clientes, $window, Estabelecimentos, Blacklist, ClientesAgendamentos) {
    $scope.favoritos = [];
    $scope.estabelecimentos = [];
    $scope.model = {};

    $scope.init = function() {
      $scope.favorito = false;
      Favoritos.get(function(error, favoritos) {
        if(error) return console.warn(error);
        $scope.favoritos = favoritos;
      });
      Favoritos.getEstabelecimentos(function(error, estabelecimentos) {
        if(error) return console.warn(error);
        $scope.estabelecimentos = estabelecimentos;
      });
    };

    $scope.novo = function() {
      $scope.favorito = {};
    };

    $scope.cancelar = function() {
      $scope.favorito = false;
    };

    $scope.criar = function() {
      Favoritos.create($scope.model.estabelecimentoFavorito, function(error, data) {
        if(error) return console.warn(error);
        $window.alert('Favorito criado');
        $scope.init();
      });
    };

    $scope.excluir = function(id) {
      if(!$window.confirm('Essa operação não poderá ser revertida, deseja continuar?')){
        return;
      }
      Favoritos.delete(id, function(error, data) {
        if(error) return console.warn(error);
        $scope.init();
      });
    };

    $scope.openModal = function(model) {
      $scope.model = {};
      $scope.model = model;
      Favoritos.getServicos($scope.model.estabelecimento, function(error, servicos) {
        if(error) return console.warn(error);
        $scope.model.servicos = servicos;
      });
    };

    $scope.atualizarPreco = function() {
      Estabelecimentos.getProfissionaisByServico($scope.model.estabelecimento, $scope.model.servico.id_servico, function(error, profissionais) {
        if(error) return console.warn(error);
        $scope.model.profissionais = profissionais;
      });
      Estabelecimentos.getPreco($scope.model.estabelecimento, $scope.model.servico.id_servico, function(error, preco) {
        if(error) return console.warn(error);
        Favoritos.getPromocoes($scope.model.estabelecimento, $scope.model.servico.id_servico, function(error, promocao) {
          if(error) return console.warn(error);
          if(promocao && promocao.nome === $scope.model.servico.nomeservico) {
            $scope.model.promocao = promocao.preco;
            $scope.model.preco = $scope.model.promocao;
          } else {
            $scope.model.promocao = false;
            $scope.model.preco = preco.preco;
          }
        });
      });
    };



    $scope.agendar = function(model) {
      Blacklist.getByCliente(function(error, blacklist) {
        if(error) return console.warn(error);
        var blacklist = blacklist;
        if(blacklist.length >= 2) {
          return $window.alert('Você não pode agendar nesse estabelecimento porque se atrasou/faltou ao compromisso');
        }
        var dataLocal = moment($scope.model.datahora.getTime()).local().format();
        var agendamento = {
          id_estabelecimento: $scope.model.estabelecimento,
          id_profissional: $scope.model.profissional.id,
          id_servico: $scope.model.servico.id_servico,
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
