'use strict';

describe('module: exTabModule, service: ExTabModule', function () {

  // load the service's module
  beforeEach(module('exTabModule'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var ExTabModule;
  var $timeout;
  beforeEach(inject(function (_ExTabModule_, _$timeout_) {
    ExTabModule = _ExTabModule_;
    $timeout = _$timeout_;
  }));

  describe('.changeBriefly()', function () {
    beforeEach(function () {
      ExTabModule.changeBriefly();
    });
    it('should briefly change', function () {
      expect(ExTabModule.someData.binding).toEqual('Yeah this was changed');
      $timeout.flush();
      expect(ExTabModule.someData.binding).toEqual('Yes! Got that databinding working');
    });
  });

});
