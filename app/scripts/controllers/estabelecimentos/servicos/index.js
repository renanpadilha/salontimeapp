'use strict';
angular.module('salontimeApp')
  .controller('ServicosCtrl', function ($scope, $location, $routeParams, Servicos, _, $window, Categorias, Profissionais) {
    $scope.promocoes = {};
    $scope.model = {};

    $scope.init = function() {
      Servicos.all(function(error, servicos) {
        if(error) {
          return console.warn(error);
        }
        $scope.servicos = servicos;
      });
      Categorias.all(function(error, categorias) {
        if(error) {
          return console.warn(error);
        }
        $scope.categorias = categorias;
      });
      Profissionais.all(function(error, profissionais) {
        if(error) return console.warn(error);
        $scope.model.profissionais = profissionais;
      })
    };

    $scope.associar = function() {

    };

    $scope.excluir = function(id) {
      if(!$window.confirm('Essa profissional não estará mais disponível para agendamentos, deseja continuar?')){
        return;
      }
      Servicos.excluir(id, function(error, data) {
        if(error) {
          return console.warn(error);
        }
        $scope.init();
      });
    };

    $scope.cancelar = function() {
      $scope.servico = false;
    };

    $scope.novo = function() {
      $scope.servico = true;
    };

    $scope.atualizaServicos = function() {
      Categorias.getServicos($scope.model.categoriaSelecionada, function(error, servicos) {
        if(error) {
          return console.warn(error);
        }
        console.log(servicos);
        $scope.model.servicos = servicos;
      });
    };

    $scope.editar = function(id) {
      $location.path('/estabelecimentos/servicos/' + id);
    };

    $scope.init();
  });
