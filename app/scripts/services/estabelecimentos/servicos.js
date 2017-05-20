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
          if(response.data[0]) {
            response.data[0].preco = parseFloat(response.data[0].preco);
          }
          callback(null, response.data[0]);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.getEstabelecimentos = function(idServico, callback) {
      $http.get(API_URL + '/servicos/' + idServico + '/estabelecimentos')
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

    this.update = function(object, callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        var estabelecimentos_servicos = {
          id: object.id,
          preco: object.preco
        };
        $http.put(API_URL + '/estabelecimentos/' + userId + '/servicos/', estabelecimentos_servicos)
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.associarServicoProfissional = function(profissional, servico, callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        var data = {
          id_servico: servico,
          id_estabelecimento: userId
        };
        $http.post(API_URL + '/profissionais/' + profissional + '/servicos', data)
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.associarServicoEstabelecimento = function(preco, servico, callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        var data = {
          preco: preco,
          id_estabelecimento: userId,
          id_servico: servico
        };
        $http.post(API_URL + '/estabelecimentos/'+ userId +'/servicos/', data)
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.excluirServicoEstabelecimento = function(idServico, callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.delete(API_URL + '/servicos/' + idServico + '/estabelecimentos/' + userId)
        .then(function(response) {
          callback(null, response);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.excluirProfissionalServico = function(idServico, callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.delete(API_URL + '/servicos/' + idServico + '/estabelecimentos/' + userId + '/profissionais')
        .then(function(response) {
          callback(null, response);
        }, function(error) {
          callback(error, null);
        });
      });
    };

  });
