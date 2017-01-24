'use strict';
angular.module('store')
.controller('StoreMenuCtrl', function (
	$log,
	$location,
	$ionicAuth,
  $localStorage,
	$ionicFacebookAuth,
  $rootScope,
  $timeout,
  Config,
  Auth,
  Store,
  Product
) {

  /* Storing contextual this in a variable for easy access */

  var ctrl = this;

  $log.log('Hello from your Controller: StoreMenuCtrl in module store:. This is your controller:', ctrl);

  /*==============================
  =            Logout            =
  ==============================*/

  ctrl.logout = function () {
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

  /*=====  End of Logout  ======*/


  /*==============================================================
  =            Get the number of items in user's cart            =
  ==============================================================*/

  ctrl.getCartTotalNumber = function () {
    Store.getCartTotalNumber()
    .then(function (response) {
      $log.log(response.data);
      ctrl.cartTotalNumber = response.data.cartCount;
    })
    .catch(function (response) {
      $log.log(response);
    });
  };


  /*----------  call the function at the time of initialization  ----------*/

  ctrl.getCartTotalNumber();


  /*----------  catching calls from outside of this controller  ----------*/

  $rootScope.$on('getCartTotalNumber', function (event) {
    $log.log(event);
    $log.log('on getCartTotalNumber');
    ctrl.getCartTotalNumber();
  });

  /*=====  End of Get the number of items in user's cart  ======*/


  /*==========================================================================
  =            Include user's name in scope to display in sidebar            =
  ==========================================================================*/

  ctrl.username = Config.ENV.USER.NAME;

  /*=====  End of Include user's name in scope to display in sidebar  ======*/

  /*================================================================
  =            Showing server side notification message            =
  ================================================================*/

  ctrl.notification = {};

  ctrl.setNotification = function (notification) {
    ctrl.notification.type = notification.type;
    ctrl.notification.text = notification.text;
    $timeout(function () {
      ctrl.notification = {};
    }, 5000);
  };

  /*----------  catching calls from outside of this controller  ----------*/

  $rootScope.$on('setNotification', function (event, notification) {
    $log.log(event);
    ctrl.setNotification(notification);
  });

  /*=====  End of Showing server side notification message  ======*/

  /*================================================
  =            Getting top level menu            =
  ================================================*/

  ctrl.getTopLevelMenu = function () {
    Product.getChildCategories(0)
    .then(function (response) {
      $log.log(response.data);
      ctrl.topLevelMenu = response;
    })
    .catch(function (response) {
      $log.log(response);
    });
  };

  ctrl.getTopLevelMenu();

  /*=====  End of Getting top level menu  ======*/

  $rootScope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });
});
