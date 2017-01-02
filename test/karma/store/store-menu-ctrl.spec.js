'use strict';

describe('module: store, controller: StoreMenuCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var StoreMenuCtrl;
  beforeEach(inject(function ($controller) {
    StoreMenuCtrl = $controller('StoreMenuCtrl');
  }));

  it('should do something', function () {
    expect(!!StoreMenuCtrl).toBe(true);
  });

});
