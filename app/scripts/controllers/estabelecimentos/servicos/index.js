'use strict';
angular.module('salontimeApp')
  .controller('ServicosCtrl', function ($scope, $location, $routeParams, Servicos, _, $window, Categorias, Profissionais) {
    $scope.model = {};
    $scope.profissionaisAdicionados = [];

    $scope.init = function() {
      Servicos.all(function(error, servicos) {
        if(error) return console.warn(error);
        $scope.servicos = servicos;
      });
      Categorias.all(function(error, categorias) {
        if(error) return console.warn(error);
        $scope.categorias = categorias;
      });
      Profissionais.all(function(error, profissionais) {
        if(error) return console.warn(error);
        $scope.model.profissionais = profissionais;
      })
    };

    $scope.addProfissional = function(profissional) {
      if(!profissional) return console.warn('Não há profissionais associados');
      $scope.profissionaisAdicionados.push(profissional);
    };

    $scope.associar = function() {
      if(!$scope.model.categoriaSelecionada) {
        return alert('Selecione uma categoria selecionada');
      }
      if(!$scope.model.servicoSelecionado) {
        return alert('Selecione um serviço');
      }
      if(!$scope.model.preco) {
        return alert('Informe um preço');
      }
      if($scope.profissionaisAdicionados.length <= 0) {
        return alert('Informe pelo menos um profissoinal');
      }
      Servicos.associarServicoEstabelecimento($scope.model.preco, $scope.model.servicoSelecionado, function(error, data) {
        if(error) return console.warn(error);
        _.each($scope.profissionaisAdicionados, function(profissional) {
          Servicos.associarServicoProfissional(profissional.id, $scope.model.servicoSelecionado, function(error, profissional) {
            if(error) return console.warn(error);
            $scope.servico = false;
            $scope.init();
          });
        });
      });
    };

    $scope.excluir = function(id) {
      if(!$window.confirm('Esse serviço não estará mais disponível para agendamentos, deseja continuar?')){
        return;
      }
      Servicos.excluirServicoEstabelecimento($scope.model.servicoSelecionado, function(error, data) {
        if(error) return console.warn(error);
        Servico.excluirProfissionalServico($scope.model.servicoSelecionado, function(error, pro) {
          if(error) return console.warn(error);
          $scope.init();
        });
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
        if(error) return console.warn(error);
        $scope.model.servicos = servicos;
      });
    };

    $scope.editar = function(id) {
      $location.path('/estabelecimentos/servicos/' + id);
    };

    $scope.init();
  });
