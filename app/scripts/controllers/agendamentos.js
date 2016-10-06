'use strict';

/**
 * @ngdoc function
 * @name salontimeApp.controller:AgendamentosCtrl
 * @description
 * # AgendamentosCtrl
 * Controller of the salontimeApp
 */
angular.module('salontimeApp')
  .controller('AgendamentosCtrl', function () {
    $scope.model = {};
    Agendamentos.getAgendamentos().then(function(response){
      $scope.agendamentos = response.data;
    })
  });
