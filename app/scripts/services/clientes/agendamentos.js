'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.agendamentos
 * @description
 * # agendamentos
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('ClientesAgendamentos', function ($http, $routeParams) {
    var service = this;
    const API_URL = 'https://salontime.herokuapp.com/api/v1';

    this.create = function(agendamento, callback) {
      $http.post(API_URL + '/clientes/' + 1 + '/agendamentos', agendamento)
      .then(function(response) {
        console.log('Agendado', response.data);
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

    this.cancel = function(id, callback) {
      $http.delete(API_URL + '/agendamentos/' + id)
      .then(function(response) {
        console.log('resposta delete',response);
        callback(null, response);
      }, function(error){
        callback(error, null);
      });
    }
  });
