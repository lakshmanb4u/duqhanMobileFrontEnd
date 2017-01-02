'use strict';

describe('module: store, controller: StoreDebugCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var StoreDebugCtrl;
  beforeEach(inject(function ($controller) {
    StoreDebugCtrl = $controller('StoreDebugCtrl');
  }));

  describe('.grade()', function () {

    it('should classify asd as weak', function () {
      StoreDebugCtrl.password.input = 'asd';
      StoreDebugCtrl.grade();
      expect(StoreDebugCtrl.password.strength).toEqual('weak');
    });

    it('should classify asdf as medium', function () {
      StoreDebugCtrl.password.input = 'asdf';
      StoreDebugCtrl.grade();
      expect(StoreDebugCtrl.password.strength).toEqual('medium');
    });

    it('should classify asdfasdfasdf as strong', function () {
      StoreDebugCtrl.password.input = 'asdfasdfasdf';
      StoreDebugCtrl.grade();
      expect(StoreDebugCtrl.password.strength).toEqual('strong');
    });
  });

});
