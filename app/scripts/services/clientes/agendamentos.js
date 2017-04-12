'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.agendamentos
 * @description
 * # agendamentos
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('ClientesAgendamentos', function ($http, $routeParams, Authentication) {
    var service = this;
    const API_URL = 'https://salontime.herokuapp.com/api/v1';

    this.create = function(agendamento, callback) {
      //TODO Adicionar variavel de logado
      Authentication.me(function(data) {
        var userId = data
        $http.post(API_URL + '/clientes/' + userId + '/agendamentos', agendamento)
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.cancel = function(id, callback) {
      $http.delete(API_URL + '/agendamentos/' + id)
      .then(function(response) {
        callback(null, response);
      }, function(error){
        callback(error, null);
      });
    };

    this.qualify = function(agendamento, callback) {
      $http.patch(API_URL + '/agendamentos/' + agendamento.id, agendamento)
      .then(function(response) {
        callback(null, response);
      }, function(error) {
        callback(error, null);
      });
    };
  });
