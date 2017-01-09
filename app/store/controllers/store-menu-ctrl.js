'use strict';
angular.module('store')
.controller('StoreMenuCtrl', function (
	$log,
	$location,
	$ionicAuth,
  $localStorage,
	$ionicFacebookAuth,
  Config
) {

  var ctrl = this;

  $log.log('Hello from your Controller: StoreMenuCtrl in module store:. This is your controller:', ctrl);

  ctrl.logout = function () {
    // $ionicAuth.logout();
    var savedUser = JSON.parse($localStorage.savedUser);
    if (savedUser.socialLogin) {
      $ionicFacebookAuth.logout();
    }
    $localStorage.$reset();
    $location.path('/landing');
  };

  ctrl.username = Config.ENV.USER.NAME;

});
