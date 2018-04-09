'use strict';
angular
  .module('main')
  .controller('GuestUserCtrl', function (
    $log,
    $location,
    $state,
    $localStorage,
    $rootScope,
    $ionicAuth,
    $ionicFacebookAuth,
    $ionicUser,
    $cordovaGeolocation,
    $timeout,
    Config,
    Auth,
    Firebase,
    $stateParams,
    $http
  ) {
    var ctrl = this;

    $log.log(
      'Hello from your Controller: UserCtrl in module auth:. ctrl is your controller:',
      ctrl
    );

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
    if ($stateParams.productId !== '') {
      $localStorage.pId = $stateParams.productId;
      ctrl.productId = $localStorage.pId;
    }
    var posOptions = { timeout: 1000, enableHighAccuracy: false };
    $cordovaGeolocation.getCurrentPosition(posOptions).then(
      function (position) {
        $log.log('Geolocation = ');
        $log.log(position);
        Config.ENV.USER.LATITUDE = position.coords.latitude;
        Config.ENV.USER.LONGITUDE = position.coords.longitude;
      },
      function (err) {
        $log.log('Geolocation error = ');
        $log.log(err);
      }
    );
    ctrl.internalLogin = function (user) {
      var posOptions = { timeout: 1000, enableHighAccuracy: false };
      var s = new Date().getTime();
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(
        function (position) {
          $log.log('Geolocation = ');
          $log.log(position);
          Config.ENV.USER.LATITUDE = position.coords.latitude;
          Config.ENV.USER.LONGITUDE = position.coords.longitude;
          user.countryCode = ctrl.countryCode;
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
        }
        )
        .then(function (user) {
          return Auth.login(user);
        })
        .then(function (response) {
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Mob Login','JS Mob login',t);
          $log.log(response);
          ctrl.savedUser.email = user.email;
          ctrl.savedUser.password = user.password;
          ctrl.savedUser.name = response.data.name;
          ctrl.savedUser.authtoken = response.data.authtoken;
          ctrl.savedUser.profileImage = response.data.profileImg;
          ctrl.savedUser.freeProductEligibility = response.data.freeProductEligibility;
          Config.ENV.USER.AUTH_TOKEN = response.data.authtoken;
          Config.ENV.USER.NAME = response.data.name;
          Config.ENV.USER.PROFILE_IMG = response.data.profileImg;
          $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
          $rootScope.$emit('setUserDetailForMenu');
          if (ctrl.savedUser.freeProductEligibility) {
            // $state.go('store.freeProducts');
            $state.go('store.product.overview', {productId: $localStorage.pId});
          } else {
            $state.go('store.product.overview', {productId: $localStorage.pId});
          }
          if (window.cordova) {
            /* eslint-disable no-undef */
            intercom.reset();
            intercom.registerIdentifiedUser(
              {
                userId: ctrl.savedUser.userId,
                email: ctrl.savedUser.email
              }
            );
            intercom.updateUser({
              /* eslint-disable camelcase */
              custom_attributes: {
                customer_name: ctrl.savedUser.name
              }
              /* eslint-enable camelcase */
            });
          }
          /* eslint-enable no-undef */
          if (Config.ENV.DEEP_LINK) {
            $timeout(function () {
              $location.path(Config.ENV.DEEP_LINK);
            }, 1000);
          }

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
          //$state.go('landing');
          $rootScope.$emit('onLoginFail', ctrl.responseCB);
        });
    };

    ctrl.internalFacebookLogin = function () {
      $log.log('facebookLogin');
      var fields = ['email','public_profile'];
      var userDetails = {};
      var img = null;
      var posOptions = { timeout: 1000, enableHighAccuracy: false };
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(
        function (position) {
          $log.log('Geolocation = ');
          $log.log(position);
          Config.ENV.USER.LATITUDE = position.coords.latitude;
          Config.ENV.USER.LONGITUDE = position.coords.longitude;
          var s = new Date().getTime();
          facebookConnectPlugin.login(['email','public_profile'],function (successObj) {
            var authResponse = successObj.authResponse.accessToken;
            facebookConnectPlugin.api('/me?fields=id,name,email,picture&access_token='+authResponse,null, function(res) {
              userDetails = res;
              var fbUser = {};
              fbUser.email = userDetails.email;//$ionicUser.social.facebook.data.email;
              fbUser.name = userDetails.name;//$ionicUser.social.facebook.data.full_name;
              fbUser.fbid = userDetails.id;//$ionicUser.social.facebook.uid;
              fbUser.latitude = Config.ENV.USER.LATITUDE;
              fbUser.longitude = Config.ENV.USER.LONGITUDE;
              fbUser.userAgent = ionic.Platform.ua;
              img = userDetails.picture.data.url;//$ionicUser.social.facebook.data.profile_picture;
           
              Auth.fbLogin(fbUser).then(function(res1){
                var e = new Date().getTime();
                var t = e-s;
                Store.awsCloudWatch('JS Mob Fb login','JS Mob fb-login',t);
                ctrl.savedUser.email = userDetails.email;//$ionicUser.social.facebook.data.email;
                ctrl.savedUser.name = userDetails.name;//$ionicUser.social.facebook.data.full_name;
                ctrl.savedUser.userId = userDetails.id;//$ionicUser.social.facebook.userId;
                ctrl.savedUser.authtoken = res1.data.authtoken;
                ctrl.savedUser.profileImage = res1.data.profileImg ? res1.data.profileImg : img;
                ctrl.savedUser.freeProductEligibility = res1.data.freeProductEligibility;
                ctrl.savedUser.socialLogin = true;
                Config.ENV.USER.AUTH_TOKEN = res1.data.authtoken;
                Config.ENV.USER.NAME = res1.data.name;
                Config.ENV.USER.PROFILE_IMG = ctrl.savedUser.profileImage;
                $rootScope.$emit('setUserDetailForMenu');
                $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
                if (ctrl.savedUser.freeProductEligibility) {
                  // $state.go('store.freeProducts');
                  $state.go('store.product.overview', {productId: $localStorage.pId});
                } else {
                  $state.go('store.product.overview', {productId: $localStorage.pId});
                }
                if (window.cordova) {
                  /* eslint-disable no-undef */
                  intercom.reset();
                  intercom.registerIdentifiedUser({
                    userId: ctrl.savedUser.userId,
                    email: ctrl.savedUser.email
                  });
                  intercom.updateUser({
                  /* eslint-disable camelcase */
                  custom_attributes: {
                    customer_name: ctrl.savedUser.name
                  }
                  /* eslint-enable camelcase */
                });
              }
              /* eslint-enable no-undef */
              if (Config.ENV.DEEP_LINK) {
                $timeout(function () {
                  $location.path(Config.ENV.DEEP_LINK);
                }, 1000);
              }
            })
            //return Firebase.includeFCMToken(fbUser);
            }, function(err){
              console.log("err-", err);
            });
          },function (err) {
            console.log('facebook error --', err);
          });
        },
        function (err) {
          $log.log('Geolocation error = ');
          $log.log(err);
           var s = new Date().getTime(); 
           facebookConnectPlugin.login(['email','public_profile'],function (successObj) {
            var authResponse = successObj.authResponse.accessToken;
            facebookConnectPlugin.api('/me?fields=id,name,email,picture&access_token='+authResponse,null, function(res) {
              userDetails = res;
              var fbUser = {};
              fbUser.email = userDetails.email;//$ionicUser.social.facebook.data.email;
              fbUser.name = userDetails.name;//$ionicUser.social.facebook.data.full_name;
              fbUser.fbid = userDetails.id;//$ionicUser.social.facebook.uid;
              fbUser.latitude = Config.ENV.USER.LATITUDE;
              fbUser.longitude = Config.ENV.USER.LONGITUDE;
              fbUser.userAgent = ionic.Platform.ua;
              img = userDetails.picture.data.url;//$ionicUser.social.facebook.data.profile_picture;
           
              Auth.fbLogin(fbUser).then(function(res1){
                var e = new Date().getTime();
                var t = e-s;
                Store.awsCloudWatch('JS Mob Fb login','JS Mob fb-login',t);
                ctrl.savedUser.email = userDetails.email;//$ionicUser.social.facebook.data.email;
                ctrl.savedUser.name = userDetails.name;//$ionicUser.social.facebook.data.full_name;
                ctrl.savedUser.userId = userDetails.id;//$ionicUser.social.facebook.userId;
                ctrl.savedUser.authtoken = res1.data.authtoken;
                ctrl.savedUser.profileImage = res1.data.profileImg ? res1.data.profileImg : img;
                ctrl.savedUser.freeProductEligibility = res1.data.freeProductEligibility;
                ctrl.savedUser.socialLogin = true;
                Config.ENV.USER.AUTH_TOKEN = res1.data.authtoken;
                Config.ENV.USER.NAME = res1.data.name;
                Config.ENV.USER.PROFILE_IMG = ctrl.savedUser.profileImage;
                $rootScope.$emit('setUserDetailForMenu');
                $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
                if (ctrl.savedUser.freeProductEligibility) {
                  // $state.go('store.freeProducts');
                  $state.go('store.product.overview', {productId: $localStorage.pId});
                } else {
                  $state.go('store.product.overview', {productId: $localStorage.pId});
                }
                if (window.cordova) {
                  /* eslint-disable no-undef */
                  intercom.reset();
                  intercom.registerIdentifiedUser({
                    userId: ctrl.savedUser.userId,
                    email: ctrl.savedUser.email
                  });
                  intercom.updateUser({
                  /* eslint-disable camelcase */
                  custom_attributes: {
                    customer_name: ctrl.savedUser.name
                  }
                  /* eslint-enable camelcase */
                });
              }
              /* eslint-enable no-undef */
              if (Config.ENV.DEEP_LINK) {
                $timeout(function () {
                  $location.path(Config.ENV.DEEP_LINK);
                }, 1000);
              }
            })
            //return Firebase.includeFCMToken(fbUser);
            }, function(err){
              console.log("err-", err);
            });
          },function (err) {
            console.log('facebook error --', err);
          });
          /*return $ionicFacebookAuth.login();*/
        })  
        /*.then(function (fbUser) {
          return Auth.fbLogin(fbUser);
        })*/
        /*.then(function (response) {
          
        .catch(function (error) {
          $log.log(error);
          $localStorage.$reset();
          $state.go('landing');
        });*/
    };

    ctrl.autoLogin = function () {
      var savedUser = $localStorage.savedUser;
      $log.log(savedUser);
      if (!savedUser) {
        return;
      }

      var parsedUser = JSON.parse(savedUser);
      $log.log(parsedUser);

      if (parsedUser.socialLogin) {
      /*  if ($ionicAuth.isAuthenticated()) {*/
        var fbUser = {};
        fbUser.email = parsedUser.email;//$ionicUser.social.facebook.data.email;
        fbUser.name = parsedUser.name;//$ionicUser.social.facebook.data.full_name;
        fbUser.fbid = parsedUser.userId;//$ionicUser.social.facebook.uid;
        var img = parsedUser.profileImage;//$ionicUser.social.facebook.data.profile_picture;
        $log.log('FB picture ================');
        $log.log(img);
        Firebase.includeFCMToken(fbUser)
          .then(function (fbUser) {
            return Auth.fbLogin(fbUser);
          })
          .then(function (response) {
            $log.log(response);
            ctrl.savedUser.email = parsedUser.email;//$ionicUser.social.facebook.data.email;
            ctrl.savedUser.name = parsedUser.name;//$ionicUser.social.facebook.data.full_name;
            ctrl.savedUser.userId = parsedUser.userId;//$ionicUser.social.facebook.userId;
            ctrl.savedUser.profileImage = response.data.profileImg ? response.data.profileImg : img;
            ctrl.savedUser.freeProductEligibility = response.data.freeProductEligibility;
            ctrl.savedUser.authtoken = response.data.authtoken;
            ctrl.savedUser.socialLogin = true;
            Config.ENV.USER.AUTH_TOKEN = response.data.authtoken;
            Config.ENV.USER.NAME = response.data.name;
            Config.ENV.USER.PROFILE_IMG = ctrl.savedUser.profileImage;
            $rootScope.$emit('setUserDetailForMenu');
            $log.log('FB picture ================');
            $log.log(img);
            $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
            if (ctrl.savedUser.freeProductEligibility) {
              // $state.go('store.freeProducts');
              $state.go('store.products.latest');
            } else {
              $state.go('store.products.latest');
            }
            if (window.cordova) {
              /* eslint-disable no-undef */
              intercom.reset();
              intercom.registerIdentifiedUser(
                {
                  userId: ctrl.savedUser.userId,
                  email: ctrl.savedUser.email
                }
              );
              intercom.updateUser({
                /* eslint-disable camelcase */
                custom_attributes: {
                  customer_name: ctrl.savedUser.name
                }
                /* eslint-enable camelcase */
              });
            }
            /* eslint-enable no-undef */
            if (Config.ENV.DEEP_LINK) {
              $timeout(function () {
                $location.path(Config.ENV.DEEP_LINK);
              }, 1000);
            }
          })
          .catch(function (error) {
            $log.log(error);
            $localStorage.$reset();
            $state.go('landing');
          });
       /* } else {
          ctrl.internalFacebookLogin();
        }*/
      } else {
        var user = {};
        user.email = parsedUser.email;
        user.password = parsedUser.password;
        ctrl.internalLogin(user);
      }
    };

    ctrl.login = function () {
      if (ctrl.buttonView) {
        ctrl.buttonView = false;
        ctrl.loginButtonText = 'Login';
      } else {
        ctrl.responseCB = '';
        if (ctrl.loginForm.$valid) {
          ctrl.loginForm.submitted = true;
          ctrl.internalLogin(ctrl.user);
        }
      }
    };

    $rootScope.$on('onLoginFail', function (event, response) {
      ctrl.responseCB = response;
    });

    if (window.cordova) {
      // eslint-disable-next-line no-undef
      intercom.registerUnidentifiedUser();
      // eslint-disable-next-line no-undef
      intercom.setLauncherVisibility('VISIBLE');
    }
    // Catching calls from outside this controller
    $rootScope.$on('internalGuestLogin', function (event, user) {
      $log.log(event);
      $log.log('on internalLogin');
      ctrl.internalLogin(user);
    });
    $rootScope.$on('internalGuestFacebookLogin', function (event) {
      $log.log(event);
      $log.log('on internalFacebookLogin');
      ctrl.internalFacebookLogin();
    });
    $http.get('http://ip-api.com/json')
    .success(function (data) {
      console.log(data.countryCode);
      ctrl.countryCode = data.countryCode;
    });
  });
