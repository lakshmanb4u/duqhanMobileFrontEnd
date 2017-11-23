'use strict';

describe('module: store, controller: SizeChartCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var SizeChartCtrl;
  beforeEach(inject(function ($controller) {
    SizeChartCtrl = $controller('SizeChartCtrl');
  }));

  it('should do something', function () {
    expect(!!SizeChartCtrl).toBe(true);
  });

});
