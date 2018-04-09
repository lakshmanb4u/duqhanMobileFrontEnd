'use strict';
angular.module('store')
  .controller('StoreMenuCtrl', function (
    $log,
    $location,
    $ionicAuth,
    $localStorage,
    $ionicFacebookAuth,
    $rootScope,
    $ionicHistory,
    $timeout,
    $state,
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
    ctrl.guest = true;
    if ($localStorage.savedUser) {
      var savedUser = JSON.parse($localStorage.savedUser);
      if (savedUser.email === 'guest@gmail.com') {
        ctrl.guest = false;
      }
    }
    ctrl.logout = function () {
      if (window.cordova) {
        // eslint-disable-next-line no-undef
        intercom.reset();
      }
      if ($localStorage.savedUser) {
        var savedUser = JSON.parse($localStorage.savedUser);
        if (savedUser.socialLogin) {
          facebookConnectPlugin.logout(function (success) {

          },function (err) {
            console.log('facebook error --', err);
          });
        }
        var s = new Date().getTime();
        Auth.logout(savedUser)
          .then(function (response) {
            var e = new Date().getTime();
            var t = e-s;
            Store.awsCloudWatch('JS Mob Logout','JS Mob logout',t);
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
      var s = new Date().getTime();
      Store.getCartTotalNumber()
        .then(function (response) {
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Mob Get cart count','JS Mob get-cart-count',t);
          $log.log(response.data);
          ctrl.cartTotalNumber = response.data.cartCount;
        })
        .catch(function (response) {
          $log.log(response);
        });
    };

   /* ctrl.callGetProduct = function(){
      console.log("ssss");
      if($state.current.name == 'store.productsByCategory'){
        $rootScope.$emit("getSubCategoryProduct");
      }
      window.history.back();
    }*/


    /*----------  call the function at the time of initialization  ----------*/

    ctrl.getCartTotalNumber();


    /*----------  catching calls from outside of this controller  ----------*/

    /*=====  End of Get the number of items in user's cart  ======*/


    /*==========================================================================
    =            Include user's name and image in scope to display in sidebar            =
    ==========================================================================*/

    ctrl.setUserDetailForMenu = function () {
      ctrl.username = Config.ENV.USER.NAME;
      ctrl.profileImage = Config.ENV.USER.PROFILE_IMG;
      ctrl.guest = true;
      if ($localStorage.savedUser) {
        var savedUser = JSON.parse($localStorage.savedUser);
        if (savedUser.email === 'guest@gmail.com') {
          ctrl.guest = false;
        }
      }
    };

    ctrl.setUserDetailForMenu();

    $rootScope.$on('setUserDetailForMenu', function (event) {
      $log.log(event);
      ctrl.setUserDetailForMenu();
    });

    $rootScope.$on('getCartTotalNumber', function (event) {
      $log.log(event);
      ctrl.getCartTotalNumber();
    });

    /*=====  End of Include user's name and image in scope to display in sidebar  ======*/

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
          ctrl.topLevelMenu = response;
          $log.log('ctrl.topLevelMenu=======================================');
          $log.log(ctrl.topLevelMenu);
          $log.log('ctrl.topLevelMenu=======================================');
        })
        .catch(function (response) {
          $log.log(response);
        });
    };

    ctrl.activeTab = '';
    ctrl.getActiveclass = function (name, statevalue) {
      if (ctrl.activeTab === name && statevalue) {
        return 'active';
      }
      return '';
    };

    ctrl.setCategoryName = function (name) {
      ctrl.activeTab = name;
    };


    ctrl.getTopLevelMenu();

    ctrl.goToRoot = function (){
      $state.go('store.products.latest');
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
    }
    /*=====  End of Getting top level menu  ======*/

    /*============================================
    =            Show hide search bar            =
    ============================================*/

    $rootScope.searcBarActive = false;
    ctrl.toggleSearchBar = function () {
      $rootScope.searcBarActive = !$rootScope.searcBarActive;
    };

    ctrl.searchProduct = function () {
      ctrl.toggleSearchBar();
      $log.log(ctrl.searchText);
      $state.go('store.productsSearch', { searchText: ctrl.searchText });
    };

    /*=====  End of Show hide search bar  ======*/

    $rootScope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });
  });
