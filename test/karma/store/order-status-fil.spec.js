'use strict';

describe('module: store, filter: orderStatusFilter', function () {

  // load the filter's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // initialize a new instance of the filter before each test
  var $filter;
  beforeEach(inject(function (_$filter_) {
    $filter = _$filter_('orderStatusFilter');
  }));

  it('should return the input prefixed with "orderStatusFilter filter:"', function () {
    var text = 'angularjs';
    expect($filter(text)).toBe('orderStatusFilter filter: ' + text);
  });

});
