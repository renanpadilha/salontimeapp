'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.estabelecimentos
 * @description
 * # estabelecimentos
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('Estabelecimentos', function ($http, $routeParams) {
    var service = this;
    const API_URL = 'http://localhost:4002/api/v1';

    this.getAgendamentos = function(callback) {
      $http.get(API_URL + '/estabelecimentos/' + 1 + '/agendamentos')
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

    this.getProfissionais = function(callback) {
      $http.get(API_URL + '/estabelecimentos/' + 1 + '/profissionais')
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

    this.getProfissionaisByServico = function(idEstabelecimento, idServico, callback) {
      $http.get(API_URL + '/estabelecimentos/' + idEstabelecimento + '/servicos/' + idServico + '/profissionais')
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };
  });
