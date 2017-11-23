'use strict';

describe('module: store, service: Product', function () {

  // load the service's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Product;
  beforeEach(inject(function (_Product_) {
    Product = _Product_;
  }));

  it('should do something', function () {
    expect(!!Product).toBe(true);
  });

});
