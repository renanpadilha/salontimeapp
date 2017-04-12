'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.authentication
 * @description
 * # authentication
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('Authentication', function ($rootScope, $http, $localStorage) {
    var service = this;
    const API_URL = 'https://salontime.herokuapp.com/api/v1';
    this.login = function(username, password, callback) {
      $http.post(API_URL + '/authentication',
        [username, password],
        { 'Content-Type': 'application/json' }
      ).then(function(response) {
        $localStorage.loggedInUser = response.data;
        callback(null, response.data);
      }, function(error){
        console.error(error);
        callback('O usuário informado não pode ser encontrado.', null);
      });
    };
    this.logout = function(callback) {
      $localStorage.$reset();
      callback();
    };
    this.getLoggedInUser = function(callback) {
      return callback($localStorage.loggedInUser);
    };
    this.isLoggedIn = function() {
      return service.getLoggedInUser(function(data){
        return !!data;
      });
    };
    this.me = function(callback) {
      if($localStorage.loggedInUser.tipo === 'C'){
        $http.get(API_URL + '/clientelogado')
        .then(function(response) {
          console.log('ae', response);
          callback(null, response.data);
        }, function(error) {
          callback(error, null);
          console.warn(error);
        });
      } else {
        $http.get(API_URL + '/estabelecimentologado')
        .then(function(response) {
          $localStorage.estabelecimentoLogado = response.data;
          callback(null, $localStorage.estabelecimentoLogado);
        }, function(error) {
          callback(error, null);
          console.warn(error);
        });
      }
    };
  });
