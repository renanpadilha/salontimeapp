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
    'ui.bootstrap',
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
      .when('/agendamentos', {
        templateUrl: 'views/agendamentos/index.html',
        controller: 'AgendamentosCtrl',
        controllerAs: 'ctrl'
      })
      .when('/agendamentos/edit/:id', {
        templateUrl: 'views/agendamentos/edit.html',
        controller: 'AgendamentosEditCtrl',
        controllerAs: 'ctrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
