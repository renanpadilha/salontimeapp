'use strict';

/**
 * @ngdoc overview
 * @name salontimeApp
 * @description
 * # salontimeApp
 *
 * Main module of the application.
 */
angular
  .module('salontimeApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/agendamentos', {
        templateUrl: 'views/agendamentos.html',
        controller: 'AgendamentosCtrl',
        controllerAs: 'agendamentos'
      })
      .when('/clientes', {
        templateUrl: 'views/clientes.html',
        controller: 'ClientesCtrl',
        controllerAs: 'clientes'
      })
      .when('/estabelecimentos', {
        templateUrl: 'views/estabelecimentos.html',
        controller: 'EstabelecimentosCtrl',
        controllerAs: 'estabelecimentos'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
