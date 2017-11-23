'use strict';

describe('module: auth, controller: Forgot-passwordCtrl', function () {

  // load the controller's module
  beforeEach(module('auth'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ForgotPasswordCtrl;
  beforeEach(inject(function ($controller) {
    ForgotPasswordCtrl = $controller('ForgotPasswordCtrl');
  }));

  it('should do something', function () {
    expect(!!ForgotPasswordCtrl).toBe(true);
  });

});
