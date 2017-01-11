'use strict';
angular.module('store')
.controller('StoreMenuCtrl', function (
	$log,
	$location,
	$ionicAuth,
  $localStorage,
	$ionicFacebookAuth,
  Config,
  Auth
) {

  var ctrl = this;

  $log.log('Hello from your Controller: StoreMenuCtrl in module store:. This is your controller:', ctrl);

  ctrl.logout = function () {
    // $ionicAuth.logout();
    if ($localStorage.savedUser) {
      var savedUser = JSON.parse($localStorage.savedUser);
      if (savedUser.socialLogin) {
        $ionicFacebookAuth.logout();
      }
      Auth.logout(savedUser)
      .then(function (response) {
        $log.log(response);
        $localStorage.$reset();
        $location.path('/landing');
      })
      .catch(function (response) {
        $log.log(response);
        if (response.data.statusCode === '403') {
          ctrl.responseCB = 'Invalid credential.';
        } else {
          ctrl.responseCB = 'Something went wrong. Please try again.';
        }
      });
    } else {
      $location.path('/landing');
    }
  };

  ctrl.username = Config.ENV.USER.NAME;
});
