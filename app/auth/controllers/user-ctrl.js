'use strict';
angular.module('main')
.controller('UserCtrl', function (
  $log,
  $location,
  $state,
  $localStorage,
  $rootScope,
  $ionicAuth,
  $ionicFacebookAuth,
  $ionicUser,
  $cordovaGeolocation,
  Config,
  Auth,
  BusyLoader,
  Firebase
) {

  var ctrl = this;

  $log.log('Hello from your Controller: UserCtrl in module auth:. ctrl is your controller:', ctrl);

  ctrl.user = {
    email: '',
    password: ''
  };
  ctrl.savedUser = {
    email: '',
    password: '',
    name: '',
    authtoken: '',
    socialLogin: false,
    userId: ''
  };

  ctrl.loggingUser = {};

  var posOptions = {timeout: 1000, enableHighAccuracy: false};
  $cordovaGeolocation
  .getCurrentPosition(posOptions)
  .then(function (position) {
    $log.log('Geolocation = ');
    $log.log(position);
    Config.ENV.USER.LATITUDE = position.coords.latitude;
    Config.ENV.USER.LONGITUDE = position.coords.longitude;
  },
  function (err) {
    $log.log('Geolocation error = ');
    $log.log(err);
  });

  ctrl.internalLogin = function (user) {
    BusyLoader.show();
    var posOptions = {timeout: 1000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function (position) {
      $log.log('Geolocation = ');
      $log.log(position);
      Config.ENV.USER.LATITUDE = position.coords.latitude;
      Config.ENV.USER.LONGITUDE = position.coords.longitude;
      user.latitude = Config.ENV.USER.LATITUDE;
      user.longitude = Config.ENV.USER.LONGITUDE;
      user.userAgent = ionic.Platform.ua;
      return Firebase.includeFCMToken(user);
    },
    function (err) {
      $log.log('Geolocation error = ');
      $log.log(err);
      user.latitude = Config.ENV.USER.LATITUDE;
      user.longitude = Config.ENV.USER.LONGITUDE;
      user.userAgent = ionic.Platform.ua;
      return Firebase.includeFCMToken(user);
    })
    .then(function (user) {
      return Auth.login(user);
    })
    .then(function (response) {
      $log.log(response);
      ctrl.savedUser.email = user.email;
      ctrl.savedUser.password = user.password;
      ctrl.savedUser.name = response.data.name;
      ctrl.savedUser.authtoken = response.data.authtoken;
      ctrl.savedUser.profileImage = response.data.profileImg;
      Config.ENV.USER.AUTH_TOKEN = response.data.authtoken;
      Config.ENV.USER.NAME = response.data.name;
      Config.ENV.USER.PROFILE_IMG = response.data.profileImg;
      $rootScope.$emit('setUserDetailForMenu');
      $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
      BusyLoader.hide();
      $state.go('store.products.latest');
      //$location.path('/store/products/latest');
    })
    .catch(function (response) {
      $log.log(response);
      $localStorage.$reset();
      if (response.data.statusCode === '403') {
        ctrl.responseCB = 'Invalid credential.';
      } else {
        ctrl.responseCB = 'Something went wrong. Please try again.';
      }
      BusyLoader.hide();
      $state.go('landing');
    });
  };

  ctrl.internalFacebookLogin = function () {
    BusyLoader.show();
    $log.log('facebookLogin');
    var img = null;
    var posOptions = {timeout: 1000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function (position) {
      $log.log('Geolocation = ');
      $log.log(position);
      Config.ENV.USER.LATITUDE = position.coords.latitude;
      Config.ENV.USER.LONGITUDE = position.coords.longitude;
      return $ionicFacebookAuth.login();
    },
    function (err) {
      $log.log('Geolocation error = ');
      $log.log(err);
      return $ionicFacebookAuth.login();
    })
    .then(function () {
      $log.log('FB data ================');
      $log.log($ionicUser.social.facebook);
      var fbUser = {};
      fbUser.email = $ionicUser.social.facebook.data.email;
      fbUser.name = $ionicUser.social.facebook.data.full_name;
      fbUser.fbid = $ionicUser.social.facebook.uid;
      fbUser.latitude = Config.ENV.USER.LATITUDE;
      fbUser.longitude = Config.ENV.USER.LONGITUDE;
      fbUser.userAgent = ionic.Platform.ua;
      img = $ionicUser.social.facebook.data.profile_picture;
      $log.log('FB picture ================');
      $log.log(img);
      return Firebase.includeFCMToken(fbUser);
    })
    .then(function (fbUser) {
      return Auth.fbLogin(fbUser);
    })
    .then(function (response) {
      $log.log('FB response =====================');
      $log.log(response);
      ctrl.savedUser.email = $ionicUser.social.facebook.data.email;
      ctrl.savedUser.name = $ionicUser.social.facebook.data.full_name;
      ctrl.savedUser.userId = $ionicUser.social.facebook.userId;
      ctrl.savedUser.authtoken = response.data.authtoken;
      ctrl.savedUser.profileImage = img;
      ctrl.savedUser.socialLogin = true;
      Config.ENV.USER.AUTH_TOKEN = response.data.authtoken;
      Config.ENV.USER.NAME = response.data.name;
      Config.ENV.USER.PROFILE_IMG = img;
      $rootScope.$emit('setUserDetailForMenu');
      $log.log('FB picture ================');
      $log.log(img);
      $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
      BusyLoader.hide();
      $state.go('store.products.latest');
    })
    .catch(function (error) {
      $log.log(error);
      $localStorage.$reset();
      BusyLoader.hide();
      $state.go('landing');
    });
  };

  ctrl.autoLogin = function () {
    BusyLoader.show();
    var savedUser = $localStorage.savedUser;
    $log.log(savedUser);
    if (!savedUser) {
      BusyLoader.hide();
      return;
    }

    var parsedUser = JSON.parse(savedUser);
    $log.log(parsedUser);

    if (parsedUser.socialLogin) {
      if ($ionicAuth.isAuthenticated()) {
        var fbUser = {};
        fbUser.email = $ionicUser.social.facebook.data.email;
        fbUser.name = $ionicUser.social.facebook.data.full_name;
        fbUser.fbid = $ionicUser.social.facebook.uid;
        var img = $ionicUser.social.facebook.data.profile_picture;
        $log.log('FB picture ================');
        $log.log(img);
        Firebase.includeFCMToken(fbUser)
        .then(function (fbUser) {
          return Auth.fbLogin(fbUser);
        })
        .then(function (response) {
          $log.log(response);
          ctrl.savedUser.email = $ionicUser.social.facebook.data.email;
          ctrl.savedUser.name = $ionicUser.social.facebook.data.full_name;
          ctrl.savedUser.userId = $ionicUser.social.facebook.userId;
          ctrl.savedUser.profileImage = img;
          ctrl.savedUser.authtoken = response.data.authtoken;
          ctrl.savedUser.socialLogin = true;
          Config.ENV.USER.AUTH_TOKEN = response.data.authtoken;
          Config.ENV.USER.NAME = response.data.name;
          Config.ENV.USER.PROFILE_IMG = img;
          $rootScope.$emit('setUserDetailForMenu');
          $log.log('FB picture ================');
          $log.log(img);
          $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
          BusyLoader.hide();
          $state.go('store.products.latest');
        })
        .catch(function (error) {
          $log.log(error);
          $localStorage.$reset();
          BusyLoader.hide();
          $state.go('landing');
        });
      } else {
        ctrl.internalFacebookLogin();
      }
    } else {
      var user = {};
      user.email = parsedUser.email;
      user.password = parsedUser.password;
      ctrl.internalLogin(user);
    }
  };

  // Call autologin
  ctrl.autoLogin();

  // Catching calls from outside this controller
  $rootScope.$on('internalLogin', function (event, user) {
    $log.log(event);
    $log.log('on internalLogin');
    ctrl.internalLogin(user);
  });
  $rootScope.$on('internalFacebookLogin', function (event) {
    $log.log(event);
    $log.log('on internalFacebookLogin');
    ctrl.internalFacebookLogin();
  });
});
