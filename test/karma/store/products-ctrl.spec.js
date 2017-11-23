'use strict';

describe('module: store, controller: ProductsCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ProductsCtrl;
  beforeEach(inject(function ($controller) {
    ProductsCtrl = $controller('ProductsCtrl');
  }));

  it('should do something', function () {
    expect(!!ProductsCtrl).toBe(true);
  });

});
