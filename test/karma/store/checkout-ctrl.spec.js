'use strict';

describe('module: store, controller: CheckoutCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var CheckoutCtrl;
  beforeEach(inject(function ($controller) {
    CheckoutCtrl = $controller('CheckoutCtrl');
  }));

  it('should do something', function () {
    expect(!!CheckoutCtrl).toBe(true);
  });

});
