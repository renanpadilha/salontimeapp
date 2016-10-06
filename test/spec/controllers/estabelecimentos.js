'use strict';

describe('Controller: EstabelecimentosCtrl', function () {

  // load the controller's module
  beforeEach(module('salontimeApp'));

  var EstabelecimentosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EstabelecimentosCtrl = $controller('EstabelecimentosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EstabelecimentosCtrl.awesomeThings.length).toBe(3);
  });
});
