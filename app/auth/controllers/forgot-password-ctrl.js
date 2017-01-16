'use strict';
angular.module('auth')
.controller('ForgotPasswordCtrl', function (
	$log,
	$location,
	$ionicAuth,
  Auth
  ) {

  var ctrl = this;

  $log.log('Hello from your Controller: ForgotPasswordCtrl in module auth:. This is your controller:', ctrl);

  ctrl.user = {
    email: '',
    resetCode: '',
    newPassword: ''
  };
  ctrl.requestPasswordReset = function () {
    ctrl.responseCB = '';
    if (ctrl.requestPasswordResetForm.$valid) {
      Auth.requestPasswordReset(ctrl.user.email)
      .then(function (response) {
        $log.log(response);
        $location.path('/change-password');
      })
      .catch(function (response) {
        $log.log(response);
        ctrl.responseCB = 'This email is not registered with us.';
      });
    }
  };
  ctrl.confirmPasswordReset = function () {
    ctrl.responseCB = '';
    if (ctrl.confirmPasswordResetForm.$valid) {
      ctrl.user.newPassword = ctrl.user.newPassword;
      Auth.confirmPasswordReset(ctrl.user)
      .then(function (response) {
        $log.log(response);
        $location.path('/login');
      })
      .catch(function (response) {
        $log.log(response);
      });
    }
  };
});
