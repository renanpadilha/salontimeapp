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
    const POSTMON = 'http://api.postmon.com.br/v1/cep/'

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

    this.cadastrar = function(cliente, callback) {
      $http.post(API_URL + '/register', cliente)
      .then(function(response) {
        var usuario = response.data;
        _.extend(cliente, {
          id_usuario: usuario.id
        });
        switch (usuario.tipo) {
          case 'C':
            $http.post(API_URL + '/clientes', cliente)
            .then(function(response) {
              console.log('Cliente criado', response.data);
            }, function(error) {
              console.warn(error);
            });
            break;
          case 'E':
            $http.post(API_URL + '/estabelecimentos', cliente)
            .then(function(response) {
              console.log('estabelecimento criado', response.data);
            }, function(error) {
              console.warn(error);
            });
            break;
          default:
            console.warn('Erro ao registrar');
        }
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

  });
