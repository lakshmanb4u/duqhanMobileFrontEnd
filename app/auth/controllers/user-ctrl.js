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
  Config,
  Auth
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

  ctrl.internalLogin = function (user) {
    Auth.login(user)
    .then(function (response) {
      $log.log(response);
      ctrl.savedUser.email = user.email;
      ctrl.savedUser.password = user.password;
      ctrl.savedUser.name = response.data.name;
      ctrl.savedUser.authtoken = response.data.authtoken;
      Config.ENV.USER.AUTH_TOKEN = response.data.authtoken;
      Config.ENV.USER.NAME = response.data.name;
      $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
      $state.go('store.products.latest');
      //$location.path('/store/products/latest');
    })
    .catch(function (response) {
      $log.log(response);
      if (response.data.statusCode === '403') {
        ctrl.responseCB = 'Invalid credential.';
      } else {
        ctrl.responseCB = 'Something went wrong. Please try again.';
      }
      $state.go('login');
    });
  };

  ctrl.internalLoginForFBUsers = function (fbUser) {
    Auth.fbLogin(fbUser)
    .then(function (response) {
      $log.log(response);
      ctrl.savedUser.email = $ionicUser.social.facebook.data.email;
      ctrl.savedUser.name = $ionicUser.social.facebook.data.full_name;
      ctrl.savedUser.userId = $ionicUser.social.facebook.userId;
      ctrl.savedUser.authtoken = response.data.authtoken;
      ctrl.savedUser.socialLogin = true;
      Config.ENV.USER.AUTH_TOKEN = response.data.authtoken;
      Config.ENV.USER.NAME = response.data.name;
      $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
      $state.go('store.products.latest');
      //$location.path('/store/products/latest');
    })
    .catch(function (response) {
      $log.log(response);
      if (response.data.statusCode === '403') {
        ctrl.responseCB = 'Invalid credential.';
      } else {
        ctrl.responseCB = 'Something went wrong. Please try again.';
      }
      $state.go('login');
    });
  };

  ctrl.internalFacebookLogin = function () {
    $log.log('facebookLogin');
    $ionicFacebookAuth.login()
    .then(function () {
      $log.log($ionicUser.social.facebook);

      var fbUser = {};
      fbUser.email = $ionicUser.social.facebook.data.email;
      fbUser.name = $ionicUser.social.facebook.data.full_name;
      fbUser.fbid = $ionicUser.social.facebook.uid;
      ctrl.internalLoginForFBUsers(fbUser);
      // $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
      // $location.path('/store/products/latest');
    }, function (error) {
      $log.log(error);
      $state.go('login');
    });
  };

  // Auto log in for the already logged in users
  // if ($location.path().indexOf('/landing') >= 0) {
  ctrl.autoLogin = function () {
    var savedUser = $localStorage.savedUser;
    $log.log(savedUser);
    if (savedUser) {
      var parsedUser = JSON.parse(savedUser);
      $log.log(parsedUser);
      if (parsedUser.socialLogin) {
        if ($ionicAuth.isAuthenticated()) {
          $state.go('store.products.latest');
          //$location.path('/store/products/latest');
        } else {
          ctrl.internalFacebookLogin();
        }
      } else {
        var user = {};
        user.email = parsedUser.email;
        user.password = parsedUser.password;
        ctrl.internalLogin(user);
      }
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
