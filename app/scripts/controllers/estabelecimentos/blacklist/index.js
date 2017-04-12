'use strict';
angular.module('salontimeApp')
  .controller('EstabelecimentosBlacklistCtrl', function ($scope, Estabelecimentos, Blacklist) {
    $scope.init = function() {
      Blacklist.getByEstabelecimento(function(error, blacklist) {
        if(error) {
          console.warn(error);
          return;
        }
        console.log(blacklist);
        $scope.blacklist = blacklist;
      });
    };

    $scope.remover = function(idCliente) {
      Blacklist.remover(idCliente, function(error, data) {
        if(error) {
          console.log(error);
          return;
        }
        switch (data.status) {
          case 204:
            alert('Cliente removido da blacklist com sucesso');
            break;
          case 404:
            alert('Não foi possível localizar o agendamento');
            break;
          default:
            alert('Não foi possível cancelar o agendamento');
        }
      });
      $scope.init();
    };

    $scope.init();
  });
