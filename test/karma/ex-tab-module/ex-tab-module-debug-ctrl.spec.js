'use strict';

describe('module: exTabModule, controller: ExTabModuleDebugCtrl', function () {

  // load the controller's module
  beforeEach(module('exTabModule'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ExTabModuleDebugCtrl;
  beforeEach(inject(function ($controller) {
    ExTabModuleDebugCtrl = $controller('ExTabModuleDebugCtrl');
  }));

  describe('.grade()', function () {

    it('should classify asd as weak', function () {
      ExTabModuleDebugCtrl.password.input = 'asd';
      ExTabModuleDebugCtrl.grade();
      expect(ExTabModuleDebugCtrl.password.strength).toEqual('weak');
    });

    it('should classify asdf as medium', function () {
      ExTabModuleDebugCtrl.password.input = 'asdf';
      ExTabModuleDebugCtrl.grade();
      expect(ExTabModuleDebugCtrl.password.strength).toEqual('medium');
    });

    it('should classify asdfasdfasdf as strong', function () {
      ExTabModuleDebugCtrl.password.input = 'asdfasdfasdf';
      ExTabModuleDebugCtrl.grade();
      expect(ExTabModuleDebugCtrl.password.strength).toEqual('strong');
    });
  });

});
