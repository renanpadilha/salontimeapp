'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.agendamentos
 * @description
 * # agendamentos
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('EstabelecimentosAgendamentos', function ($http, $routeParams) {
    var service = this;
    const API_URL = 'http://localhost:4002/api/v1';

    this.create = function(agendamento, callback) {
      //TODO Adicionar variavel de logado
      $http.post(API_URL + '/estabelecimentos/' + 1 + '/agendamentos', agendamento)
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

    this.cancel = function(id, callback) {
      $http.delete(API_URL + '/agendamentos/' + id)
      .then(function(response) {
        callback(null, response);
      }, function(error){
        callback(error, null);
      });
    }

  });
