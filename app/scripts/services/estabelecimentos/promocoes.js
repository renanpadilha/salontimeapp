'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.promocoes
 * @description
 * # promocoes
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('EstabelecimentosPromocoes', function ($http, $routeParams) {
    var service = this;
    const API_URL = 'http://localhost:4002/api/v1';

    this.create = function(promocao, callback) {
      $http.post(API_URL + '/promocoes', promocao)
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

    this.cancel = function(id, callback) {
      $http.delete(API_URL + '/promocoes/' + id)
      .then(function(response) {
        callback(null, response);
      }, function(error){
        callback(error, null);
      });
    };

    this.getPromocoes = function(callback) {
      $http.get(API_URL + '/estabelecimentos/' + 1 + '/promocoes')
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
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
