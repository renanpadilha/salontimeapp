'use strict';
angular.module('salontimeApp')
  .service('Profissionais', function ($http) {
    var service = this;
    const API_URL = 'http://localhost:4002/api/v1';

    this.get = function(id, callback) {
      $http.get(API_URL + '/profissionais/' + id)
      .then(function(response) {
        callback(null, response.data[0]);
      }, function(error) {
        callback(error, null);
      });
    };

    this.create = function(object, callback) {
      //TODO Adicionar variavel de logado
      var profissional = {
        nome: object.nome,
        telefone: object.telefone,
        email: object.email,
        porcentagem: object.porcentagem,
        id_estabelecimento: 1
      };
      $http.post(API_URL + '/profissionais/', profissional)
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

    this.update = function(profissional, callback) {
      $http.put(API_URL + '/profissionais/' + profissional.id, profissional)
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };
  });
