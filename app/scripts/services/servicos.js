'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.estabelecimentos
 * @description
 * # estabelecimentos
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('Servicos', function ($http) {
    const API_URL = 'http://localhost:9002/api/v1';
    return {
      getServicos: function(){
        return $http({
          url: API_URL + '/servicos',
          method: 'GET'
        })
      }
    }
  });
