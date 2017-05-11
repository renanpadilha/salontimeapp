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
      $http.get(API_URL + '/servicos/' + id)
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        calback(error, null);
      });
    };

    this.associateEmployee = function(object, callback) {
      // Authentication.me(function(error, data) {
      //   var userId = data[0].id;
      //   var servico = {
      //
      //   };
      // });
    };

    this.excluir = function(idServico, callback) {
      //IMPLEMENTAR DELETE
    };

  });
