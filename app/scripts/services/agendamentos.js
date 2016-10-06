'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.agendamentos
 * @description
 * # agendamentos
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('agendamentos', function ($http) {
    const API_URL = 'http://localhost:9002/api/v1';
    return {
      getAgendamentos: function(){
        return $http({
          url: API_URL + '/agendamentos',
          method: 'GET'
        })
      }
    }
  });
