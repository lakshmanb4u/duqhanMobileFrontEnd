'use strict';

describe('module: store, controller: OrderHistoryCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var OrderHistoryCtrl;
  beforeEach(inject(function ($controller) {
    OrderHistoryCtrl = $controller('OrderHistoryCtrl');
  }));

  it('should do something', function () {
    expect(!!OrderHistoryCtrl).toBe(true);
  });

});
