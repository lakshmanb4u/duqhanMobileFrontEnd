'use strict';
angular.module('auth')
.controller('LoginCtrl', function (
  $log,
  $location,
  $ionicAuth,
  $ionicFacebookAuth,
  $ionicUser,
  Auth
  ) {

  var ctrl = this;

  $log.log('Hello from your Controller: LoginCtrl in module auth:. ctrl is your controller:', ctrl);

  ctrl.user = {
    email: '',
    password: ''
  };
  ctrl.updateResult = function (type, result) {
    $log.log(type, result);
    ctrl.user.resultType = type;
    ctrl.user.result = result;
  };

  var responseCB = function (response) {
    ctrl.updateResult('Response', response);
    $location.path('/store/products/latest');
  }.bind(ctrl);

  var rejectionCB = function (rejection) {
    ctrl.updateResult('Rejection', rejection);
  }.bind(ctrl);

  // tries to sign in the user and displays the result in the UI
  ctrl.loginOld = function () {
    $ionicAuth.login('basic', ctrl.user)
    .then(responseCB)
    .catch(rejectionCB);
  };

  ctrl.login = function () {
    Auth.login(ctrl.user)
    .then(function (response) {
      $log.log(response);
      $location.path('/store/products/latest');
    })
    .catch(function (response) {
      $log.log(response);
    });
  };

  ctrl.facebookLogin = function () {
    $log.log('facebookLogin');
    // if (!$ionicAuth.isAuthenticated()) {
      $ionicFacebookAuth.login()
      .then(function (success) {
        $log.log($ionicUser.social.facebook);
        $location.path('/store/products/latest');
      }, function (error) {
        $log.log(error);
      });
    // } else {
    //   $location.path('/store/products/latest');
    // }
    
  };

});
