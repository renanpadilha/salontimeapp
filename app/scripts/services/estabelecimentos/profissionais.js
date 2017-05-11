'use strict';
angular.module('salontimeApp')
  .service('Profissionais', function ($http, Authentication) {
    var service = this;
    const API_URL = 'https://salontime.herokuapp.com/api/v1';

    this.all = function(callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.get(API_URL + '/estabelecimentos/' + userId + '/profissionais/')
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.get = function(id, callback) {
      $http.get(API_URL + '/profissionais/' + id)
      .then(function(response) {
        callback(null, response.data[0]);
      }, function(error) {
        callback(error, null);
      });
    };

    this.create = function(object, callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        var profissional = {
          nome: object.nome,
          telefone: object.telefone,
          email: object.email,
          porcentagem: object.porcentagem,
          id_estabelecimento: userId
        };
        $http.post(API_URL + '/profissionais/', profissional)
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
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

    this.excluir = function(idProfissional, callback) {
      $http.delete(API_URL + '/profissionais/' + idProfissional)
      .then(function(response) {
        callback(null, response);
      }, function(error) {
        callback(error, null);
      });
    };
  });
