'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.clientes
 * @description
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('Clientes', function ($http, $routeParams, Authentication) {
    var service = this;
    const API_URL = 'https://salontime.herokuapp.com/api/v1';

    this.getAgendamentos = function(callback) {
      Authentication.me(function(error, data) {
        var userId = data[0].id;
        $http.get(API_URL + '/clientes/' + userId + '/agendamentos')
        .then(function(response) {
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
        });
      });
    };
  });
