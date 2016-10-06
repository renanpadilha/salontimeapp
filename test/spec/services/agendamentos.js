'use strict';

describe('Service: agendamentos', function () {

  // load the service's module
  beforeEach(module('salontimeApp'));

  // instantiate service
  var agendamentos;
  beforeEach(inject(function (_agendamentos_) {
    agendamentos = _agendamentos_;
  }));

  it('should do something', function () {
    expect(!!agendamentos).toBe(true);
  });

});
