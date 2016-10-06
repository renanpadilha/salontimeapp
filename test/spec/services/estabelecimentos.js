'use strict';

describe('Service: estabelecimentos', function () {

  // load the service's module
  beforeEach(module('salontimeApp'));

  // instantiate service
  var estabelecimentos;
  beforeEach(inject(function (_estabelecimentos_) {
    estabelecimentos = _estabelecimentos_;
  }));

  it('should do something', function () {
    expect(!!estabelecimentos).toBe(true);
  });

});
