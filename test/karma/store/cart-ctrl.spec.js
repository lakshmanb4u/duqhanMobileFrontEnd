'use strict';

describe('module: store, controller: CartCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var CartCtrl;
  beforeEach(inject(function ($controller) {
    CartCtrl = $controller('CartCtrl');
  }));

  it('should do something', function () {
    expect(!!CartCtrl).toBe(true);
  });

});
