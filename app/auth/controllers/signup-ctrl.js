'use strict';
angular.module('auth')
.controller('SignupCtrl', function (
	$log,
  $rootScope,
  Auth
) {

  var ctrl = this;

  $log.log('Hello from your Controller: SignupCtrl in module auth:. This is your controller:', ctrl);

  ctrl.user = {
    email: '',
    password: '',
    name: ''
  };
  ctrl.savedUser = {
    email: '',
    password: '',
    name: '',
    authtoken: '',
    socialLogin: false,
    userId: ''
  };

  ctrl.signup = function () {
    ctrl.responseCB = '';
    if (ctrl.signupForm.$valid) {
      Auth.signup(ctrl.user)
      .then(function (response) {
        $log.log(response);
        $rootScope.$emit('internalLogin', ctrl.user);
      })
      .catch(function (response) {
        $log.log(response);
        if (response.data.statusCode === '403') {
          ctrl.responseCB = response.data.status;
        } else {
          ctrl.responseCB = 'Something went wrong. Please try again.';
        }
      });
    }
  };

  ctrl.facebookLogin = function () {
    $rootScope.$emit('internalFacebookLogin', ctrl.user);
  };

});
