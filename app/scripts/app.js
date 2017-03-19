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
      .when('/clientes/agendamentos', {
        templateUrl: 'views/clientes/agendamentos/index.html',
        controller: 'ClientesAgendamentosCtrl',
        controllerAs: 'ctrl'
      })
      .when('/estabelecimentos/agendamentos', {
        templateUrl: 'views/estabelecimentos/agendamentos/index.html',
        controller: 'EstabelecimentosAgendamentosCtrl',
        controllerAs: 'ctrl'
      })
      .when('/estabelecimentos/profissionais', {
        templateUrl: 'views/estabelecimentos/profissionais/index.html',
        controller: 'EstabelecimentosProfissionaisCtrl',
        controllerAs: 'ctrl'
      })
      .when('/estabelecimentos/profissionais/:id', {
        templateUrl: 'views/estabelecimentos/profissionais/edit.html',
        controller: 'EstabelecimentosProfissionaisEditCtrl',
        controllerAs: 'ctrl'
      })
      .when('/estabelecimentos/promocoes', {
        templateUrl: 'views/estabelecimentos/promocoes/index.html',
        controller: 'PromocoesCtrl',
        controllerAs: 'ctrl'
      })
      .when('/estabelecimentos/promocoes/:id', {
        templateUrl: 'views/estabelecimentos/promocoes/edit.html',
        controller: 'PromocoesEditCtrl',
        controllerAs: 'ctrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
