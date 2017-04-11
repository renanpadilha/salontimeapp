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
    // const API_URL = 'https://salontime.herokuapp.com/api/v1';
    const API_URL = 'http://localhost:4002/api/v1';
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
  });
