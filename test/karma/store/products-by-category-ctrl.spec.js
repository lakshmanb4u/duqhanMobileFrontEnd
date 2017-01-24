'use strict';

describe('module: store, controller: ProductsByCategoryCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ProductsByCategoryCtrl;
  beforeEach(inject(function ($controller) {
    ProductsByCategoryCtrl = $controller('ProductsByCategoryCtrl');
  }));

  it('should do something', function () {
    expect(!!ProductsByCategoryCtrl).toBe(true);
  });

});
