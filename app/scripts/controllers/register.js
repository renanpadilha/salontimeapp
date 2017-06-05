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
        var usuario = {
          tipo: 'C',
          username: $scope.cliente.username,
          password: $scope.cliente.password,
        };
        Register.usuario(usuario, function(error, data) {
          if(error) {
            console.warn(error);
            return;
          }
          var cliente = {
            id_usuario: data.id,
            nome: $scope.cliente.nome,
            email: $scope.cliente.email,
            telefone: $scope.cliente.telefone
          };
          Register.cliente(cliente, function(error, cliente) {
            if(error) {
              console.warn(error);
              return;
            }
            alert('Cliente cadastrado com sucesso');
            $location.path('/login');
          });
        });
          break;
        case 'E':
          var complemento = $scope.endereco.complemento ? '/' + $scope.endereco.complemento : '';
          var endereco = $scope.endereco.logradouro + ', ' + $scope.endereco.numero + complemento + ', ' + $scope.endereco.cidade + ' - ' + $scope.endereco.estado;
          var usuario = {
            tipo: 'E',
            username: $scope.cliente.username,
            password: $scope.cliente.password,
          };
        Register.usuario(usuario, function(error, data) {
          if(error) {
            console.warn(error);
            return;
          }
          var estabelecimento = {
            id_usuario: data.id,
            email: $scope.cliente.email,
            nome: $scope.cliente.nome,
            telefone: $scope.cliente.telefone,
            endereco: endereco
          };
          Register.estabelecimento(estabelecimento, function(error, estabelecimento) {
            if(error) {
              console.warn(error);
              return;
            }
            alert('Estabelecimento cadastrado com sucesso');
            $location.path('/login');
          });
        });
          break;
        default:
        $scope.error = 'Não foi possível criar sua conta';
      }
    };
    $scope.init();
  });
