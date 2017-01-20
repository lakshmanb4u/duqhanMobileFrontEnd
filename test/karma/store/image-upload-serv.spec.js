'use strict';

describe('module: Store, service: ImageUpload', function () {

  // load the service's module
  beforeEach(module('Store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var ImageUpload;
  beforeEach(inject(function (_ImageUpload_) {
    ImageUpload = _ImageUpload_;
  }));

  it('should do something', function () {
    expect(!!ImageUpload).toBe(true);
  });

});
