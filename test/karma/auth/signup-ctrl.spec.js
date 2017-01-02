'use strict';

describe('module: auth, controller: SignupCtrl', function () {

  // load the controller's module
  beforeEach(module('auth'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var SignupCtrl;
  beforeEach(inject(function ($controller) {
    SignupCtrl = $controller('SignupCtrl');
  }));

  it('should do something', function () {
    expect(!!SignupCtrl).toBe(true);
  });

});
