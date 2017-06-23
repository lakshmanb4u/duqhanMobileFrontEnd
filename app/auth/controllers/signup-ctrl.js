'use strict';
angular.module('auth')
.controller('SignupCtrl', function (
	$log,
  $rootScope,
  $cordovaGeolocation,
  Config,
  BusyLoader,
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
      BusyLoader.show();
      ctrl.user.password = ctrl.user.password;
      var posOptions = {timeout: 1000, enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(posOptions)
      .then(function (position) {
        $log.log('Geolocation = ');
        $log.log(position);
        Config.ENV.USER.LATITUDE = position.coords.latitude;
        Config.ENV.USER.LONGITUDE = position.coords.longitude;
        ctrl.user.latitude = Config.ENV.USER.LATITUDE;
        ctrl.user.longitude = Config.ENV.USER.LONGITUDE;
        ctrl.user.userAgent = ionic.Platform.ua;
        return Auth.signup(ctrl.user);
      },
      function (err) {
        $log.log('Geolocation error = ' + err);
        ctrl.user.latitude = Config.ENV.USER.LATITUDE;
        ctrl.user.longitude = Config.ENV.USER.LONGITUDE;
        ctrl.user.userAgent = ionic.Platform.ua;
        return Auth.signup(ctrl.user);
      })
      .then(function (response) {
        $log.log(response);
        $rootScope.$emit('internalLogin', ctrl.user);
      })
      .catch(function (response) {
        BusyLoader.hide();
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
