'use strict';

describe('module: store, controller: AddressCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var AddressCtrl;
  beforeEach(inject(function ($controller) {
    AddressCtrl = $controller('AddressCtrl');
  }));

  it('should do something', function () {
    expect(!!AddressCtrl).toBe(true);
  });

});
