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
    'ngTouch',
    'ngStorage'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        authenticated: true
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'ctrl',
        authenticated: true
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'ctrl',
      })
      .when('/clientes/agendamentos', {
        templateUrl: 'views/clientes/agendamentos/index.html',
        controller: 'ClientesAgendamentosCtrl',
        controllerAs: 'ctrl',
        authenticated: true
      })
      .when('/estabelecimentos/agendamentos', {
        templateUrl: 'views/estabelecimentos/agendamentos/index.html',
        controller: 'EstabelecimentosAgendamentosCtrl',
        controllerAs: 'ctrl',
        authenticated: true
      })
      .when('/estabelecimentos/profissionais', {
        templateUrl: 'views/estabelecimentos/profissionais/index.html',
        controller: 'EstabelecimentosProfissionaisCtrl',
        controllerAs: 'ctrl',
        authenticated: true
      })
      .when('/estabelecimentos/profissionais/:id', {
        templateUrl: 'views/estabelecimentos/profissionais/edit.html',
        controller: 'EstabelecimentosProfissionaisEditCtrl',
        controllerAs: 'ctrl',
        authenticated: true
      })
      .when('/estabelecimentos/promocoes', {
        templateUrl: 'views/estabelecimentos/promocoes/index.html',
        controller: 'PromocoesCtrl',
        controllerAs: 'ctrl',
        authenticated: true
      })
      .when('/estabelecimentos/promocoes/:id', {
        templateUrl: 'views/estabelecimentos/promocoes/edit.html',
        controller: 'PromocoesEditCtrl',
        controllerAs: 'ctrl',
        authenticated: true
      })
      .otherwise({
        redirectTo: '/404',
        templateUrl: '404.html'
      });
  })
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
  }])
  .run(function($rootScope, $location, Authentication, $route) {
    $rootScope.isLoggedIn = function() {
      return Authentication.getLoggedInUser(function(data) {
        return !!data;
      });
    };
    $rootScope.logout = function() {
      Authentication.logout(function(){
        $location.path('/login');
        $route.reload();
      });
    };
    $rootScope.$on('$routeChangeStart', function(event, next) {
      if (!$rootScope.isLoggedIn()) {
        if (next.authenticated === true) {
          $location.path('/login');
        }
      } else {
        if (next.templateUrl === 'views/login.html') {
          $location.path('/');
        }
      }
    });

  });
