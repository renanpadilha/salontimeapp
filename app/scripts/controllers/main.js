'use strict';

/**
 * @ngdoc function
 * @name salontimeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the salontimeApp
 */
angular.module('salontimeApp')
  .controller('MainCtrl', function ($scope, $routeParams, Main, $http) {
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
      $scope.dt = new Date(year, month, day);
    };

    $scope.format = 'dd/MM/yyyy';
    $scope.altInputFormats = 'dd/MM/yyyy';

    $scope.popup = {
      opened: false
    };

    $scope.time = new Date();
    $scope.time.setMinutes(0);
    $scope.hstep = 1;
    $scope.mstep = 30;
    $scope.ismeridian = false;
  /* FINAL DATEPICKER + TIMEPICKER */
});
