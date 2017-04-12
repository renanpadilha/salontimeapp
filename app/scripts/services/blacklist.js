'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.clientes
 * @description
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('Blacklist', function ($http, $routeParams, Authentication) {
    var service = this;
    const API_URL = 'https://salontime.herokuapp.com/api/v1';

    this.getByCliente = function(callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.get(API_URL + '/blacklist/' + userId)
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.getByEstabelecimento = function(callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.get(API_URL + '/estabelecimentos/' + userId + '/blacklist')
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.remover = function(idCliente, callback) {
      $http.delete(API_URL + '/blacklist/' + idCliente)
      .then(function(response) {
        callback(null, response);
      }, function(error){
        callback(error, null);
      });
    }

    this.create = function(idcliente, callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        var dadosBlacklist = {
          id_cliente: idcliente,
          id_estabelecimento: userId
        };
        $http.post(API_URL + '/blacklist', dadosBlacklist)
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };
  });
