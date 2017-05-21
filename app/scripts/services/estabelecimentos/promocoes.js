
'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.promocoes
 * @description
 * # promocoes
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('Promocoes', function ($http, $routeParams, Authentication) {
    var service = this;
    const API_URL = 'https://salontime.herokuapp.com/api/v1';

    this.get = function(idPromocao, callback) {
      $http.get(API_URL + '/promocoes/' + idPromocao)
      .then(function(response) {
        callback(null, response.data[0]);
        console.log(response.data[0]);
      }, function(error) {
        callback(error, null);
      });
    };

    this.create = function(object, callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        var promocao = {
          nome: object.nome,
          id_estabelecimento: userId,
          id_servico: object.id_servico,
          preco: object.preco
        };
        $http.post(API_URL + '/promocoes', promocao)
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.cancel = function(id, callback) {
      $http.delete(API_URL + '/promocoes/' + id)
      .then(function(response) {
        callback(null, response);
      }, function(error) {
        callback(error, null);
      });
    };

    this.getPromocoes = function(callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.get(API_URL + '/estabelecimentos/' + userId + '/promocoes')
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.update = function(promocao, callback) {
      $http.put(API_URL + '/promocoes/' + promocao.id, promocao)
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

  });
