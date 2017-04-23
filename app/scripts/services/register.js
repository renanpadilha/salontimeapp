'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.estabelecimentos
 * @description
 * # estabelecimentos
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('Register', function ($http, _) {
    var service = this;
    const API_URL = 'https://salontime.herokuapp.com/api/v1';
    const POSTMON = 'https://api.postmon.com.br/v1/cep/'

    this.findEndereco = function(cep, callback) {
      $http.get(POSTMON + cep)
      .then(function(response) {
        var data = response.data;
        var localidade = {
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado
        };
        callback(null, localidade);
      }, function(error) {
        callback(error, null);
      });
    };

    this.usuario = function(usuario, callback) {
      $http.post(API_URL + '/register', usuario)
      .then(function(response) {
        callback(null, response.data[0]);
      }, function(error) {
        callback(error, null);
      });
    };

    this.cliente = function(cliente, callback) {
      $http.post(API_URL + '/clientes', cliente)
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

    this.estabelecimento = function(estabelecimento, callback) {
      $http.post(API_URL + '/estabelecimentos', estabelecimento)
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

  });
