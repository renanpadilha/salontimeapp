
'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.promocoes
 * @description
 * # promocoes
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('Promocoes', function ($http, $routeParams) {
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
      //TODO Adicionar variavel de logado
      var promocao = {
        nome: object.nome,
        id_estabelecimento: 1,
        id_servico: object.servico.id,
        preco: object.preco
      };
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
      }, function(error) {
        callback(error, null);
      });
    };

    this.getPromocoes = function(callback) {
      //TODO Adicionar variavel de logado
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
