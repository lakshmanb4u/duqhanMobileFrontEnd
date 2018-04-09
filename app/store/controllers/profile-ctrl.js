'use strict';
angular.module( 'store' )
  .controller( 'ProfileCtrl', function (
    $scope,
    $log,
    $ionicActionSheet,
    $ionicPopup,
    $rootScope,
    $filter,
    $localStorage,
    Store,
    ImageUpload,
    BusyLoader,
    ionicDatePicker,
    Config
  ) {

    /* Storing contextual this in a variable for easy access */

    var ctrl = this;

    $log.log( 'Hello from your Controller: ProfileCtrl in module store:. This is your controller:', this );


    /*============================================
    =            Prefill profile form            =
    ============================================*/

    ctrl.user = {};

    ctrl.getProfileDetails = function () {
      var savedUser = $localStorage.savedUser;
      var parsedUser = JSON.parse( savedUser );
      $log.log( parsedUser );
      var s = new Date().getTime();
      Store.getProfileDetails()
        .then( function ( response ) {
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Mob Get profile details','JS Mob get-profile-details',t);
          $log.log( response );
          ctrl.user = response.data;
          if ( !response.data.mobile ) {
            ctrl.user.mobile = undefined;
          } else {
            ctrl.user.mobile = Number( response.data.mobile );
          }
          if ( parsedUser.socialLogin ) {
            ctrl.user.socialLogin = true;
            if ( !response.data.profileImg ) {
              ctrl.user.profileImg = Config.ENV.USER.PROFILE_IMG;
            }
          }
          $log.log( ctrl.user );
        } )
        .catch( function ( response ) {
          $log.log( response );
        } );
    };
    ctrl.getCountryCode = function () {
      Store.getCountryCode()
        .then( function ( response ) {
          $log.log( response );
          ctrl.countryCode = response.data.currencyCodes;
          console.log(ctrl.countryCode);
          $log.log( ctrl.user );
        } )
        .catch( function ( response ) {
          $log.log( response );
        } );
    };

    ctrl.user.image = 'store/assets/images/user.png';

    ctrl.getProfileDetails();
    ctrl.getCountryCode();
    /*----------  call the function when user is in profile page  ----------*/

    $rootScope.$on( '$stateChangeSuccess', function ( event, toState ) {
      if ( toState.name === 'store.profile' ) {
        ctrl.getProfileDetails();
        ctrl.getCountryCode();
      }
    } );

    /*=====  End of Prefill profile form  ======*/


    /*============================================
    =            Profile image upload            =
    ============================================*/

    /*----------  Open image source selector Action Sheet   ----------*/

    ctrl.openImageSourceSelector = function () {
      $log.log( ionic.Platform.device() );
      ImageUpload.getImageSource()
        .then( function ( source ) {
          $log.log( source );
          return ImageUpload.getPicture( source );
        } )
        .then( function ( url ) {
          BusyLoader.show();
          return Store.updateProfileImage( url, ctrl.user.id );
        } )
        .then( function ( data ) {
          $log.log( data );
          var res = JSON.parse( data.response );
          $log.log( res );
          ctrl.user.profileImg = res.profileImg;
          Config.ENV.USER.PROFILE_IMG = ctrl.user.profileImg;
          $rootScope.$emit( 'setUserDetailForMenu' );
          BusyLoader.hide();
        } )
        .catch( function ( response ) {
          $log.log( response );
          BusyLoader.hide();
        } );
    };

    /*=====  End of Profile image upload  ======*/

    /*==============================================
    =            Update profile details            =
    ==============================================*/

    ctrl.updateProfileDetails = function () {
      $log.log( ctrl.user );
      if ( ctrl.updateUserProfileForm.$valid ) {
        ctrl.user.dob = $filter( 'date' )( new Date( ctrl.user.dob ), 'dd/MM/yyyy' );
        var s = new Date().getTime();
        Store.updateProfileDetails( ctrl.user )
          .then( function ( response ) {
            var e = new Date().getTime();
            var t = e-s;
            Store.awsCloudWatch('JS Mob Update profile details','JS Mob update-profile-details',t);
            $log.log( response );
            ctrl.user = response.data;
            ctrl.user.mobile = Number( response.data.mobile );
            Config.ENV.USER.NAME = response.data.name;
            Config.ENV.USER.PROFILE_IMG = response.data.profileImg;
            $rootScope.$emit( 'setUserDetailForMenu' );
            var notification = {};
            notification.type = 'success';
            notification.text = 'Profile updated successfully';
            $rootScope.$emit( 'setNotification', notification );
          } )
          .catch( function ( response ) {
            $log.log( response );
          } );
      }
    };

    /*=====  End of Update profile details  ======*/

    /*=======================================
    =            ionic-datepicker            =
    =======================================*/

    var options = {
      callback: function ( val ) {
        ctrl.user.dob = val;
      },
      from: new Date( 1917, 1, 1 ),
      to: new Date(),
      // inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: true,
      disableWeekdays: [ 0 ],
      closeOnSelect: false,
      dateFormat: 'dd MM yyyy',
      templateType: 'popup'
    };

    ctrl.openDatePicker = function () {
      ionicDatePicker.openDatePicker( options );
    };

    /*=====  End of ionic-datepicker  ======*/

  } );
