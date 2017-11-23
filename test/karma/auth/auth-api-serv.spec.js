'use strict';

describe('module: auth, factory: Auth', function () {

  // load the service's module
  beforeEach(module('auth'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Auth;
  beforeEach(inject(function (_Auth_) {
    Auth = _Auth_;
  }));

  it('should do something', function () {
    expect(!!Auth).toBe(true);
  });

});
