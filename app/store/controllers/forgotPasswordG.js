'use strict';
angular.module('main')
.controller('ForgotPasswordCtrlG', function (
	$log,
	$location,
	$ionicAuth,
  $state,
  $stateParams,
  $rootScope,
  Auth
  ) {

  var ctrl = this;

  $log.log('Hello from your Controller: ForgotPasswordCtrl in module store:. This is your controller:', ctrl);

  ctrl.user = {
    email: '',
    resetCode: '',
    newPassword: ''
  };
  if ($stateParams.productId !== '') {
    console.log($stateParams.productId);
    $rootScope.prodId = $stateParams.productId;
  }
  ctrl.requestPasswordReset = function () {
    ctrl.responseCB = '';
    if (ctrl.requestPasswordResetForm.$valid) {
      var user = {};
      user.email = ctrl.user.email;
      Auth.requestPasswordReset(user)
      .then(function (response) {
        $log.log(response);
        $state.go('store.changePassword', { email: response.data.email,productId: $rootScope.prodId});
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
      Auth.confirmPasswordReset(ctrl.user)
      .then(function (response) {
        $log.log(response);
        $location.path('/store/guest-login/' + $rootScope.prodId);
      })
      .catch(function (response) {
        $log.log(response);
      });
    }
  };
});
