'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.categroias
 * @description
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('Categorias', function ($http, $routeParams) {
    var service = this;
    const API_URL = 'https://salontime.herokuapp.com/api/v1';

    this.all = function(callback) {
      $http.get(API_URL + '/categorias')
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    };

    this.getServicos = function(idCategoria, callback) {
      $http.get(API_URL + '/categorias/' + idCategoria + '/servicos')
      .then(function(response) {
        callback(null, response.data);
      }, function(error) {
        callback(error, null);
      });
    }

  });
