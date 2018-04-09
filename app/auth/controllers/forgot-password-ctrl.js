'use strict';
angular.module('auth')
.controller('ForgotPasswordCtrl', function (
	$log,
	$location,
	$ionicAuth,
  $state,
  Store,
  $stateParams,
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
      var user = {};
      user.email = ctrl.user.email;
      var s = new Date().getTime();
      Auth.requestPasswordReset(user)
      .then(function (response) {
        var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Mob Request password reset','JS Mob request-password-reset',t);
        $log.log(response);
        $state.go('change-password', { email: response.data.email });
        // $location.path('/change-password');
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
      ctrl.user.email = $stateParams.email;
      ctrl.user.newPassword = ctrl.user.newPassword;
      var s = new Date().getTime();
      Auth.confirmPasswordReset(ctrl.user)
      .then(function (response) {
        var e = new Date().getTime();
          var t = e-s;
         Store.awsCloudWatch('JS Mob Confirm password reset','JS Mob confirm-password_reset',t);
        $log.log(response);
        $location.path('/login');
      })
      .catch(function (response) {
        $log.log(response);
      });
    }
  };
});
