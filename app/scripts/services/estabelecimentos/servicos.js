'use strict';
angular.module('salontimeApp')
  .service('Servicos', function ($http, Authentication) {
    var service = this;
    const API_URL = 'https://salontime.herokuapp.com/api/v1';

    this.all = function(callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.get(API_URL + '/estabelecimentos/' + userId + '/servicos')
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.get = function(id, callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.get(API_URL + '/servicos/' + id + '/estabelecimentos/' + userId)
        .then(function(response) {
          response.data[0].preco = parseFloat(response.data[0].preco);
          callback(null, response.data[0]);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.update = function(object, callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        var estabelecimentos_servicos = {
          id: object.id,
          preco: object.preco
        };
        $http.put(API_URL + '/estabelecimentos/' + userId + '/servicos', estabelecimentos_servicos)
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.associarServicoProfissional = function(profissional, servico, callback) {
      $http.post(API_URL + '/profissionais/' + profissional.id + '/servicos', servico)
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

    this.associarServicoEstabelecimento = function(preco, servico, callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        var servico = {
          preco: object.preco,
          id_estabelecimento: object.id_estabelecimento,
          id_servico: object.id_servico
        };
        $http.post(API_URL + '/estabelecimentos/'+ userId +'/servicos/', servico)
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.excluir = function(idServico, callback) {
      //IMPLEMENTAR DELETE
    };

  });
