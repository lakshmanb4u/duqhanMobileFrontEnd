'use strict';

describe('module: store, controller: ProfileCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ProfileCtrl;
  beforeEach(inject(function ($controller) {
    ProfileCtrl = $controller('ProfileCtrl');
  }));

  it('should do something', function () {
    expect(!!ProfileCtrl).toBe(true);
  });

});
