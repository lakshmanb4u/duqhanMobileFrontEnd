'use strict';

describe('module: main, service: Firebase', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Firebase;
  beforeEach(inject(function (_Firebase_) {
    Firebase = _Firebase_;
  }));

  it('should do something', function () {
    expect(!!Firebase).toBe(true);
  });

});
