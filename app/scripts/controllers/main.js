'use strict';
angular.module('salontimeApp')
  .controller('MainCtrl', function ($scope, $routeParams, $http) {
    const API_URL = 'https://salontime.herokuapp.com/api/v1';
    $scope.agendamento = {};

    $http.get(API_URL + '/categorias').then(function(response){
        $scope.categorias = response.data;
    });

    $scope.atualizaServicos = function(){
      $http.get(API_URL + '/categorias/' + $scope.categoriaSelecionada + '/servicos').then(function(response){
          $scope.servicos = response.data;
          console.log($scope.servicos);
      });
    };

    $scope.atualizaEstabelecimentos = function(){
      $http.get(API_URL + '/servicos/' + $scope.servicoSelecionado + '/estabelecimentos').then(function(response){
          $scope.estabelecimentos = response.data;
          console.log($scope.estabelecimentos);
      });
    };

    $scope.atualizaProfissionais = function(){
      $http.get(API_URL + '/estabelecimentos/' + $scope.estabelecimentoSelecionado + '/servicos/' + $scope.servicoSelecionado + '/profissionais').then(function(response){
          $scope.profissionais = response.data;
          console.log($scope.profissionais);
      });
    };

    //@TODO criar método para validar se a hora está ocupada ou não
    $scope.validaData = function(){

    };

    $scope.valorData = function(){
      console.log($scope.datahora.getTime());
      //var dataLocal = moment.parseZone($scope.datahora).local().format();
      var dataLocal = moment($scope.datahora).local().format();
      console.log('datalocal', dataLocal);
    };


    $scope.agendar = function(){
      var dataLocal = moment($scope.datahora.getTime()).local().format();
      //@TODO O ID DO USUÁRIO DEVE SER O ID DE QUEM ESTÁ LOGADO NA APLICAÇÃO
      var dadosAgendamento = {
        id_estabelecimento: $scope.estabelecimentos[0].id,
        id_profissional: $scope.profissionais[0].id,
        id_servico: $scope.servicos[0].id,
        data: dataLocal
      };

      if(!dadosAgendamento) {
        console.log('Não foram encontrados dados para solicitação');
        return;
      }
      $http.post(API_URL + '/clientes/' + 1 + '/agendamentos', dadosAgendamento).then(function(response){
        $scope.mensagem = response.data;
        console.log($scope.mensagem);
      });
    };

    //GOOGLE MAPS

    $scope.mapinha = function initAutocomplete() {
      console.log('teste');
      var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -30.0245, lng: -51.1951},
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    }

});
