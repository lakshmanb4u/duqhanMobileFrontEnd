'use strict';

describe('module: store, controller: ContactusCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ContactusCtrl;
  beforeEach(inject(function ($controller) {
    ContactusCtrl = $controller('ContactusCtrl');
  }));

  it('should do something', function () {
    expect(!!ContactusCtrl).toBe(true);
  });

});
