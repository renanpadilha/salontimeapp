'use strict';

/**
 * @ngdoc service
 * @name salontimeApp.estabelecimentos
 * @description
 * # estabelecimentos
 * Service in the salontimeApp.
 */
angular.module('salontimeApp')
  .service('Estabelecimentos', function ($http) {
    const API_URL = 'http://localhost:9002/api/v1';
    return {
      getEstabelecimentos: function(){
        return $http({
          url: API_URL + '/estabelecimentos',
          method: 'GET'
        })
      }
    }
  });
