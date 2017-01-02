'use strict';
angular.module('auth')
.controller('ForgotPasswordCtrl', function (
	$log,
	$location,
	$ionicAuth
) {

  $log.log('Hello from your Controller: ForgotPasswordCtrl in module auth:. This is your controller:', this);

  this.user = {
    email: '',
    resetCode: '',
    newPassword: ''
  };
  this.requestPasswordReset = function () {
    $ionicAuth.requestPasswordReset(this.user.email);
    $location.path('/change-password');
  };
  this.confirmPasswordReset = function () {
    $ionicAuth.confirmPasswordReset(this.user.resetCode, this.user.newPassword);
    $location.path('/login');
  };
});
