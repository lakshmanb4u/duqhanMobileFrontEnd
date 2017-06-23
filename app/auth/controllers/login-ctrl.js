'use strict';
angular.module('auth')
.controller('LoginCtrl', function (
  $log,
  $rootScope
  ) {

  var ctrl = this;

  ctrl.buttonView = true;
  ctrl.loginButtonText = 'Login with Email';

  $log.log('Hello from your Controller: LoginCtrl in module auth:. ctrl is your controller:', ctrl);

  ctrl.login = function () {
    if (ctrl.buttonView) {
      ctrl.buttonView = false;
      ctrl.loginButtonText = 'Login';
    } else {
      ctrl.responseCB = '';
      if (ctrl.loginForm.$valid) {
        $rootScope.$emit('internalLogin', ctrl.user);
      }
    }
  };

  ctrl.facebookLogin = function () {
    $rootScope.$emit('internalFacebookLogin', ctrl.user);
  };

});
