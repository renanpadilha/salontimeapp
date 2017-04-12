'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.estabelecimentos
 * @description
 * # estabelecimentos
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('Estabelecimentos', function ($http, $routeParams, Authentication) {
    var service = this;
    const API_URL = 'https://salontime.herokuapp.com/api/v1';

    this.getAgendamentos = function(callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.get(API_URL + '/estabelecimentos/' + userId + '/agendamentos')
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.getProfissionais = function(callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.get(API_URL + '/estabelecimentos/' + userId + '/profissionais')
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
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

    this.getPreco = function(idEstabelecimento, idServico, callback) {
      $http.get(API_URL + '/estabelecimentos/' + idEstabelecimento + '/servicos/' + idServico + '/precos')
      .then(function(response) {
        callback(null, response.data[0]);
      }, function(error){
        callback(error, null);
      });
    };

    this.getServicos = function(callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.get(API_URL + '/estabelecimentos/' + userId + '/servicos')
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    }
  });
