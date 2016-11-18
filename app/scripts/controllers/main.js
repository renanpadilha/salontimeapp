'use strict';
angular.module('salontimeApp')
  .controller('MainCtrl', function ($scope, $routeParams, $http) {
    const API_URL = 'http://localhost:9002/api/v1';
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

    //@TODO melhorar essa data/hora, por hora está funcionando
    var date = moment($scope.date).format('YYYY-MM-DD');
    var time = moment($scope.time).format('HH:mm:ss');
    $scope.data =  date + ' ' + time;

    $scope.agendar = function(){
      //@TODO O ID DO USUÁRIO DEVE SER O ID DE QUEM ESTÁ LOGADO NA APLICAÇÃO
      var dadosAgendamento = {
        id_estabelecimento: $scope.estabelecimentos[0].id,
        id_profissional: $scope.profissionais[0].id,
        id_servico: $scope.servicos[0].id,
        data: $scope.data
      };

      console.log(dadosAgendamento);

      if(!dadosAgendamento) {
        console.log('Não foram encontrados dados para solicitação');
        return;
      }
      $http.post(API_URL + '/clientes/' + 1 + '/agendamentos', dadosAgendamento).then(function(response){
        $scope.mensagem = response.data;
        console.log($scope.mensagem);
      });
    };

    /* DATEPICKER + TIMEPICKER */
    $scope.dateOptions = {
      dateDisabled: disabled,
      showWeeks: false,
      formatYear: 'yyyy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(),
      startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
      var date = data.date,
        mode = data.mode;
      return mode === 'day' && (date.getDay() === 0);
    }

    $scope.open = function() {
      $scope.popup.opened = true;
    };

    $scope.setDate = function(year, month, day) {
      $scope.date = new Date(year, month, day);
    };

    $scope.format = 'dd/MM/yyyy';

    $scope.popup = {
      opened: false
    };

    $scope.time = new Date();
    $scope.time.setMinutes(0);
    $scope.time.setSeconds(0);
    $scope.hstep = 1;
    $scope.mstep = 30;
    $scope.ismeridian = false;
  /* FINAL DATEPICKER + TIMEPICKER */
});
