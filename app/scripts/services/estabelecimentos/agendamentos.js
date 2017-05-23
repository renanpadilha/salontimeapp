'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.agendamentos
 * @description
 * # agendamentos
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('EstabelecimentosAgendamentos', function ($http, $routeParams, Authentication) {
    var service = this;
    const API_URL = 'https://salontime.herokuapp.com/api/v1';

    this.getCliente = function(id, callback) {
      $http.get(API_URL + '/clientes/' + id)
      .then(function(response) {
        callback(null, response.data[0]);
      }, function(error) {
        callback(error, null);
      });
    };

    this.sendEmail = function(email, callback) {
      var mensagem = {
        to: email.email,
        subject: 'SalonTime | ' + email.subject,
        message: email.message
      };
      $http.post(API_URL + '/message', mensagem)
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

    this.getRating = function(callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.get(API_URL + '/estabelecimentos/' + userId)
        .then(function (response) {
          callback(null, response.data[0].rate);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.create = function(agendamento, callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.post(API_URL + '/estabelecimentos/' + userId + '/agendamentos', agendamento)
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };

    this.cancel = function(id, callback) {
      $http.delete(API_URL + '/agendamentos/' + id)
      .then(function(response) {
        callback(null, response);
      }, function(error){
        callback(error, null);
      });
    };

    this.conclude = function(object, callback) {
      var agendamento = {
        id: object.id,
        atendido: true
      };
      $http.patch(API_URL + '/agendamentos/' + agendamento.id, agendamento)
      .then(function(response) {
        callback(null, response);
      }, function(error) {
        callback(error, null);
      });
    };

  });
