'use strict';

describe('module: store, controller: ShippingCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ShippingCtrl;
  beforeEach(inject(function ($controller) {
    ShippingCtrl = $controller('ShippingCtrl');
  }));

  it('should do something', function () {
    expect(!!ShippingCtrl).toBe(true);
  });

});
