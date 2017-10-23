'use strict';

describe('module: store, controller: FreeProductCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var FreeProductCtrl;
  beforeEach(inject(function ($controller) {
    FreeProductCtrl = $controller('FreeProductCtrl');
  }));

  it('should do something', function () {
    expect(!!FreeProductCtrl).toBe(true);
  });

});
