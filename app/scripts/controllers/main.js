'use strict';
angular.module('salontimeApp')
  .controller('MainCtrl', function ($scope, $routeParams, $http, Agendamentos, Categorias, Servicos, Estabelecimentos) {
    const API_URL = 'https://salontime.herokuapp.com/api/v1';
    $scope.agendamento = {};
    //@TODO INICIALIZAR TODAS AS VARIÁVEIS NECESSARIAS NO INIT
    // $scope.init();

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
        console.log('Estabelecimentos', $scope.estabelecimentos);
      });
    };

    $scope.atualizaProfissionais = function() {
      Estabelecimentos.getProfissionais($scope.estabelecimentoSelecionado, $scope.servicoSelecionado, function(error, profissionais) {
        if(error) {
          console.log(error);
          return;
        }
        $scope.profissionais = profissionais;
        console.log('Profissionais', $scope.profissionais);
      });
    };

    $scope.agendar = function() {
      //@TODO fazer get no banco pra saber se existe um horário igual marcado
      var dataLocal = moment($scope.datahora.getTime()).local().format();
      var agendamento = {
        id_estabelecimento: $scope.estabelecimentoSelecionado,
        id_profissional: $scope.profissionalSelecionado,
        id_servico: $scope.servicoSelecionado,
        data: dataLocal
      };
      Agendamentos.create(agendamento, function(error, data){
        if(error) {
          console.log(error);
          return;
        }
        console.log('Dados do agendamento', data);
      });
    };
});
