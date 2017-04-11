'use strict';

/**
 * @ngdoc function
 * @name zetaWebClient.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the zetaWebClient
 */
angular.module('salontimeApp')
  .controller('RegisterCtrl', function($scope, $rootScope, $location, Register) {

    $scope.init = function() {
      $scope.cliente = {};
      $scope.endereco = {};
    };

    $scope.atualizarEndereco = function(cep) {
      $scope.init();
      Register.findEndereco(cep, function(error, localidade) {
        if(error) {
          $scope.error = 'CEP não encontrado';
          console.warn(error);
          return;
        }
        $scope.endereco.logradouro = localidade.logradouro;
        $scope.endereco.bairro = localidade.bairro;
        $scope.endereco.cidade = localidade.cidade;
        $scope.endereco.estado = localidade.estado;
      });
    };

    $scope.cadastrar = function() {
      switch ($scope.cliente.tipo) {
        case 'C':
        var cliente = {
          tipo: 'C',
          email: $scope.cliente.email,
          username: $scope.cliente.username,
          senha: $scope.cliente.password,
          nome: $scope.cliente.nome,
          telefone: $scope.cliente.telefone
        };
          break;
        case 'E':
        var complemento = $scope.endereco.complemento ? '/' + $scope.endereco.complemento : '';
        var endereco = $scope.endereco.logradouro + ', ' + $scope.endereco.numero + complemento + ', ' + $scope.endereco.cidade + ' - ' + $scope.endereco.estado;
        var cliente = {
          tipo: 'E',
          email: $scope.cliente.email,
          username: $scope.cliente.username,
          senha: $scope.cliente.password,
          nome: $scope.cliente.nomeestab,
          telefone: $scope.cliente.telefone,
          endereco: endereco
        };
          break;
        default:
        $scope.error = 'Não foi possível criar sua conta';
      }
      Register.cadastrar(cliente, function(error, data) {
        if(error) {
          console.warn(error);
          return;
        }
        alert('Cliente cadastrado com sucesso');
        $location.path('/login');
      });
    };
    $scope.init();
  });
