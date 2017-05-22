'use strict';
angular.module('salontimeApp')
  .service('Favoritos', function ($http, $routeParams, Authentication) {
    var service = this;
    const API_URL = 'https://salontime.herokuapp.com/api/v1';

    this.get = function(callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.get(API_URL + '/clientes/' + userId + '/favoritos')
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.getEstabelecimentos = function(callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.get(API_URL + '/clientes/' + userId + '/estabelecimentos')
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.getServicos = function(estabelecimento, callback) {
      $http.get(API_URL + '/estabelecimentos/' + estabelecimento + '/servicos')
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

    this.getPromocoes = function(estabelecimento, callback) {
      $http.get(API_URL + '/estabelecimentos/' + estabelecimento + '/promocoes')
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

    this.create = function(estabelecimento, callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        var favorito  = {
          id_cliente: userId,
          id_estabelecimento: estabelecimento
        };
        $http.post(API_URL + '/favoritos', favorito)
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.update = function(object, callback) {
      $http.put(API_URL + '/favoritos/' + object.id, object)
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };
  });
