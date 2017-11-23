'use strict';

describe('module: store, service: Store', function () {

  // load the service's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Store;
  var $timeout;
  beforeEach(inject(function (_Store_, _$timeout_) {
    Store = _Store_;
    $timeout = _$timeout_;
  }));

  describe('.changeBriefly()', function () {
    beforeEach(function () {
      Store.changeBriefly();
    });
    it('should briefly change', function () {
      expect(Store.someData.binding).toEqual('Yeah this was changed');
      $timeout.flush();
      expect(Store.someData.binding).toEqual('Yes! Got that databinding working');
    });
  });

});
