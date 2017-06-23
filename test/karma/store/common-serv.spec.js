'use strict';

describe('module: store, service: Common', function () {

  // load the service's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Common;
  beforeEach(inject(function (_Common_) {
    Common = _Common_;
  }));

  it('should do something', function () {
    expect(!!Common).toBe(true);
  });

});
