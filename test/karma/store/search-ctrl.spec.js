'use strict';

describe('module: store, controller: SearchCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var SearchCtrl;
  beforeEach(inject(function ($controller) {
    SearchCtrl = $controller('SearchCtrl');
  }));

  it('should do something', function () {
    expect(!!SearchCtrl).toBe(true);
  });

});
