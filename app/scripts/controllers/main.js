'use strict';
angular.module('salontimeApp')
  .controller('MainCtrl', function ($scope, $routeParams, $http) {
    const API_URL = 'https://salontime.herokuapp.com/api/v1';
    $scope.agendamento = {};

    $http.get(API_URL + '/categorias').then(function(response){
        $scope.categorias = response.data;
    });

    $scope.atualizaServicos = function(){
      $http.get(API_URL + '/categorias/' + $scope.categoriaSelecionada + '/servicos').then(function(response){
          $scope.servicos = response.data;
          console.log($scope.servicos);
      });
    };

    $scope.atualizaEstabelecimentos = function(){
      $http.get(API_URL + '/servicos/' + $scope.servicoSelecionado + '/estabelecimentos').then(function(response){
          $scope.estabelecimentos = response.data;
          console.log($scope.estabelecimentos);
      });
    };

    $scope.atualizaProfissionais = function(){
      $http.get(API_URL + '/estabelecimentos/' + $scope.estabelecimentoSelecionado + '/servicos/' + $scope.servicoSelecionado + '/profissionais').then(function(response){
          $scope.profissionais = response.data;
          console.log($scope.profissionais);
      });
    };

    //@TODO criar método para validar se a hora está ocupada ou não
    $scope.validaData = function(){

    };

    $scope.valorData = function(){
      console.log($scope.datahora.getTime());
      //var dataLocal = moment.parseZone($scope.datahora).local().format();
      var dataLocal = moment($scope.datahora).local().format();
      console.log('datalocal', dataLocal);
    };


    $scope.agendar = function(){
      var dataLocal = moment($scope.datahora.getTime()).local().format();
      //@TODO O ID DO USUÁRIO DEVE SER O ID DE QUEM ESTÁ LOGADO NA APLICAÇÃO
      var dadosAgendamento = {
        id_estabelecimento: $scope.estabelecimentos[0].id,
        id_profissional: $scope.profissionais[0].id,
        id_servico: $scope.servicos[0].id,
        data: dataLocal
      };

      if(!dadosAgendamento) {
        console.log('Não foram encontrados dados para solicitação');
        return;
      }
      $http.post(API_URL + '/clientes/' + 1 + '/agendamentos', dadosAgendamento).then(function(response){
        $scope.mensagem = response.data;
        console.log($scope.mensagem);
      });
    };
});
