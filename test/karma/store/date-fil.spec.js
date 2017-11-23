'use strict';

describe('module: store, filter: dateFilter', function () {

  // load the filter's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // initialize a new instance of the filter before each test
  var $filter;
  beforeEach(inject(function (_$filter_) {
    $filter = _$filter_('dateFilter');
  }));

  it('should return the input prefixed with "dateFilter filter:"', function () {
    var text = 'angularjs';
    expect($filter(text)).toBe('dateFilter filter: ' + text);
  });

});
