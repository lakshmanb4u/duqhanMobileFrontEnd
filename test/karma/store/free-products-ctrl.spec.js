'use strict';

describe('module: store, controller: FreeProductsCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var FreeProductsCtrl;
  beforeEach(inject(function ($controller) {
    FreeProductsCtrl = $controller('FreeProductsCtrl');
  }));

  it('should do something', function () {
    expect(!!FreeProductsCtrl).toBe(true);
  });

});
