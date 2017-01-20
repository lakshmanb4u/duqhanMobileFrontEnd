'use strict';
angular.module('store')
.controller('ProfileCtrl', function ($log, $ionicActionSheet, $ionicPopup, $rootScope, $filter, Store, ImageUpload, BusyLoader) {

  /* Storing contextual this in a variable for easy access */

  var ctrl = this;

  $log.log('Hello from your Controller: ProfileCtrl in module store:. This is your controller:', this);


  /*============================================
  =            Prefill profile form            =
  ============================================*/

  ctrl.user = {};

  ctrl.getProfileDetails = function () {
    Store.getProfileDetails()
    .then(function (response) {
      $log.log(response);
      ctrl.user = response.data;
      ctrl.user.mobile = Number(response.data.mobile);
      $log.log(ctrl.user);
    })
    .catch(function (response) {
      $log.log(response);
    });
  };

  ctrl.getProfileDetails();

  /*----------  call the function when user is in profile page  ----------*/

  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    if (toState.name === 'store.profile') {
      ctrl.getProfileDetails();
    }
  });

  ctrl.user.image = 'store/assets/images/user.png';

  /*=====  End of Prefill profile form  ======*/


  /*============================================
  =            Profile image upload            =
  ============================================*/

  /*----------  Open image source selector Action Sheet   ----------*/

  ctrl.openImageSourceSelector = function () {
    $log.log(ionic.Platform.device());
    ImageUpload.getImageSource()
    .then(function (source) {
      return ImageUpload.getPicture(source);
    })
    .then(function (url) {
      return ImageUpload.uploadToCloudinary(url);
    })
    .then(function (cloudinaryUrl) {
      $log.log(cloudinaryUrl);
      ctrl.user.profileImg = cloudinaryUrl;
      var userBean = {};
      userBean.profileImg = cloudinaryUrl;
      return Store.updateProfileImage(userBean);
    })
    .then(function (response) {
      $log.log(response);
      ctrl.user.profileImg = response.data.profileImg;
      BusyLoader.hide();
    })
    .catch(function (response) {
      $log.log(response);
      BusyLoader.hide();
    });
  };

  /*=====  End of Profile image upload  ======*/

  /*==============================================
  =            Update profile details            =
  ==============================================*/

  ctrl.updateProfileDetails = function () {
    $log.log(ctrl.user);
    if (ctrl.updateUserProfileForm.$valid) {
      ctrl.user.dob = $filter('date')(new Date(ctrl.user.dob), 'dd/MM/yyyy');
      Store.updateProfileDetails(ctrl.user)
      .then(function (response) {
        $log.log(response);
        ctrl.user = response.data;
        ctrl.user.mobile = Number(response.data.mobile);
        var notification = {};
        notification.type = 'success';
        notification.text = 'Profile updated successfully';
        $rootScope.$emit('setNotification', notification);
      })
      .catch(function (response) {
        $log.log(response);
      });
    }
  };

  /*=====  End of Update profile details  ======*/

});
