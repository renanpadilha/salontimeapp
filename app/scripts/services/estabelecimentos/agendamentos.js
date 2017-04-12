'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.agendamentos
 * @description
 * # agendamentos
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('EstabelecimentosAgendamentos', function ($http, $routeParams, Authentication) {
    var service = this;
    const API_URL = 'https://salontime.herokuapp.com/api/v1';

    this.create = function(agendamento, callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.post(API_URL + '/estabelecimentos/' + userId + '/agendamentos', agendamento)
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

    this.conclude = function(object, callback) {
      var agendamento = {
        id: object.id,
        atendido: true
      };
      $http.patch(API_URL + '/agendamentos/' + agendamento.id, agendamento)
      .then(function(response) {
        callback(null, response);
      }, function(error) {
        callback(error, null);
      });
    };

  });
