'use strict';
angular.module('auth')
.controller('LoginCtrl', function (
  $log,
  $rootScope
  ) {

  var ctrl = this;

  $log.log('Hello from your Controller: LoginCtrl in module auth:. ctrl is your controller:', ctrl);

  ctrl.login = function () {
    ctrl.responseCB = '';
    if (ctrl.loginForm.$valid) {
      $rootScope.$emit('internalLogin', ctrl.user);
    }
  };

  ctrl.facebookLogin = function () {
    $rootScope.$emit('internalFacebookLogin', ctrl.user);
  };

});
