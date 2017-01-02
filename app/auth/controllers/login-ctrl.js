'use strict';
angular.module('auth')
.controller('LoginCtrl', function (
	$log,
	$location,
	$ionicAuth
) {

  $log.log('Hello from your Controller: LoginCtrl in module auth:. This is your controller:', this);

  this.user = {
    email: '',
    password: ''
  };
  this.updateResult = function (type, result) {
    $log.log(type, result);
    this.user.resultType = type;
    this.user.result = result;
  };

  var responseCB = function (response) {
    this.updateResult('Response', response);
    $location.path('/store/products/latest');
  }.bind(this);

  var rejectionCB = function (rejection) {
    this.updateResult('Rejection', rejection);
  }.bind(this);

  // tries to sign in the user and displays the result in the UI
  this.login = function () {
    $ionicAuth.login('basic', this.user)
    .then(responseCB)
    .catch(rejectionCB);
  };
});
