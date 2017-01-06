'use strict';
angular.module('auth')
.controller('SignupCtrl', function (
	$log,
	$location,
	$ionicAuth,
  Auth
) {

  var ctrl = this;

  $log.log('Hello from your Controller: SignupCtrl in module auth:. This is your controller:', ctrl);

  ctrl.user = {
    email: '',
    password: '',
    name: ''
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

  // tries to sign the user up and displays the result in the UI
  ctrl.signupOld = function () {
    $ionicAuth.signup(ctrl.user)
    .then(function () {
      ctrl.login();
    })
    .catch(rejectionCB);
  };

  // tries to sign in the user and displays the result in the UI
  ctrl.loginOld = function () {
    $ionicAuth.login('basic', {'email': ctrl.user.email, 'password': ctrl.user.password})
    .then(responseCB)
    .catch(rejectionCB);
  };

  ctrl.signup = function () {
    Auth.signup(ctrl.user)
    .then(function (response) {
      $log.log(response);
      ctrl.login();
    })
    .catch(function (response) {
      $log.log(response);
    });
  };

  ctrl.login = function () {
    delete ctrl.user.name;
    Auth.login(ctrl.user)
    .then(function (response) {
      $log.log(response);
      $location.path('/store/products/latest');
    })
    .catch(function (response) {
      $log.log(response);
    });
  };

});
