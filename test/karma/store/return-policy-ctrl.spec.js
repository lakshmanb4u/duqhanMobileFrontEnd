'use strict';

describe('module: store, controller: ReturnPolicyCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ReturnPolicyCtrl;
  beforeEach(inject(function ($controller) {
    ReturnPolicyCtrl = $controller('ReturnPolicyCtrl');
  }));

  it('should do something', function () {
    expect(!!ReturnPolicyCtrl).toBe(true);
  });

});
