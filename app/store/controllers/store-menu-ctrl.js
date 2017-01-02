'use strict';
angular.module('store')
.controller('StoreMenuCtrl', function (
	$log,
	$location,
	$ionicAuth
) {

  $log.log('Hello from your Controller: StoreMenuCtrl in module store:. This is your controller:', this);

  this.logout = function () {
    $ionicAuth.logout();
    $location.path('/landing');
  };

});
