'use strict';

describe('module: store, controller: ProductCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ProductCtrl;
  beforeEach(inject(function ($controller) {
    ProductCtrl = $controller('ProductCtrl');
  }));

  it('should do something', function () {
    expect(!!ProductCtrl).toBe(true);
  });

});
