'use strict';
angular
  .module('main', [
    'ionic',
    'ionic.cloud',
    'ionicImgCache',
    'ngCordova',
    'ui.router',
    'ngStorage',
    'angulartics',
    'angulartics.facebook.pixel',
    'auth',
    'store',
    'jkAngularRatingStars',
    'facebook'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    // $httpProvider.interceptors.push('HttpInterceptor');
    // ROUTING with ui.router
    $urlRouterProvider.otherwise('/store/products/latest');
  })
  // ADD: initialize $ionicCloudProvider with app_id
  .config(function ($ionicCloudProvider) {
    $ionicCloudProvider.init({
      core: {
        // eslint-disable-next-line camelcase
        app_id: 'ad64e5e2'
      },
      auth: {
        facebook: {
          scope: ['email', 'public_profile']
        }
      }
    });
    /*
    window.fabric.Crashlytics.addLog('about to send a crash for testing!');
    window.fabric.Crashlytics.sendCrash();*/
    var Crashlytics = FirebaseCrashlytics.initialise();
    Crashlytics.logException('my caught Exception');
    // sample index.js
  })
  /*.config(function (FacebookProvider) {
    FacebookProvider.init('698576100317336');
  })*/
  .config(function ($ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  })
  .run(function ($ionicPlatform, $q, $log, $rootScope, $state, $localStorage, $location, Auth, Config, $stateParams, $http) {
    if (window.cordova) {
      intercom.registerUnidentifiedUser();
      intercom.setLauncherVisibility('VISIBLE');
    }
    var app = {
      initialize: function () {
        console.log('in initialize');
        this.bindEvents();
      },
      bindEvents: function () {
        console.log('in bindEvents');
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('resume', this.onDeviceResume, false);
      },
      onDeviceReady: function () {
        console.log('in onDeviceReady');
        setTimeout(function () {
          if (typeof window.ga !== undefined) {
            console.log('Ga Object', window.ga);
            window.ga.startTrackerWithId('UA-120903553-1', 30);
            window.ga.debugMode();
            //window.ga.trackView('Home Screen');
          }
          else {
            console.log('error in analytics');
          }
        }, 4000);
        app.handleBranch();

      },
      onDeviceResume: function () {
        console.log('in onDeviceResume');
        app.handleBranch();
      },
      handleBranch: function () {
        // Branch initialization
        console.log('in handleBranch');
        Branch.initSession().then(function (data) {
          if (data['+clicked_branch_link']) {
            // read deep link data on click
            console.log('depp link', data);
            //$state.go('store.product', {'productId': 67702 })
            location.href = data.$android_url;
          }
        });
      }
    };
    console.log('------------------>app initialization');
    app.initialize();

    if ($localStorage.countryCode) {

    } else {
      $http.get('https://api.ipdata.co')
        .success(function (data) {
          $localStorage.countryCode = data.country_code;
        })
        .error(function (data) {
          $localStorage.countryCode = 'IN';
        });
      //$localStorage.countryCode = "IN";
    }
    $rootScope.$on('Unauthorized', function (event, response) {
      console.log('Unauthorized....');
      var savedUser = JSON.parse($localStorage.savedUser);
      Auth.logout(savedUser);
      var user = {};
      //$scope.countryCode = $localStorage.countryCode;
      Auth.guestLogin(user).then(function (response) {
        $log.log(response);
        savedUser.email = response.data.email;
        savedUser.password = user.password;
        savedUser.name = response.data.name;
        savedUser.authtoken = response.data.authtoken;
        savedUser.profileImage = response.data.profileImg;
        savedUser.freeProductEligibility = response.data.freeProductEligibility;
        Config.ENV.USER.AUTH_TOKEN = response.data.authtoken;
        Config.ENV.USER.NAME = response.data.name;
        Config.ENV.USER.PROFILE_IMG = response.data.profileImg;
        $localStorage.savedUser = JSON.stringify(savedUser);
        $rootScope.$emit('setUserDetailForMenu');
        /*if ($stateParams.url != null){
            var url = $stateParams.url;
            var productId = $stateParams.pid;
            //$location.path(url);
            $state.go(url,{ 'productId': productId })
          } else {*/
        //$state.go('store.products.latest');
        $state.reload();
        //}
      });
    });
    if (angular.isUndefined($localStorage.savedUser)) {
      var obj = {
        email: 'guest@gmail.com',
        password: 'dukhan123',
        name: 'Guest User',
        authtoken: 'dukhan123',
        fcmToken: '',
        uuid: ''
      };
      $localStorage.savedUser = JSON.stringify(obj);
    }
    if (angular.isDefined($localStorage.savedUser)) {
      var savedUser = JSON.parse($localStorage.savedUser);
      if (savedUser.email != 'guest@gmail.com') {
        if (window.cordova) {
          intercom.reset();
          intercom.registerIdentifiedUser(
            {
              userId: savedUser.userId,
              email: savedUser.email
            }
          );
          intercom.updateUser({
            custom_attributes: {
              customer_name: savedUser.name
            }
          });
        }
      }
      if (window.cordova) {
        var q = $q.defer();
        FCMPlugin.getToken(function (token) {
          savedUser.fcmToken = token;
          savedUser.uuid = window.device.uuid;
          q.resolve(savedUser);
          console.log('DeviceID======', window.device.uuid);
          console.log(savedUser);
          Auth.guestFcmToken(savedUser);
        });
      }
    }
    $rootScope.$state = $state;
    $ionicPlatform.ready(function () {
      /* eslint-disable no-undef */
      if (window.cordova) {
        try {
          setTimeout(function () {
            if (navigator.splashscreen) {
              navigator.splashscreen.hide();
            }
          }, 500);

          // then override any default you want
          window.plugins.nativepagetransitions.globalOptions.duration = 700;
          window.plugins.nativepagetransitions.globalOptions.iosdelay = 100;
          window.plugins.nativepagetransitions.globalOptions.androiddelay = 150;
          window.plugins.nativepagetransitions.globalOptions.winphonedelay = 175;
          window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 8;
          // these are used for slide left/right only
          window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 64;
          window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 48;
        } catch (e) {
          $log.log(e);
        }
        FCMPlugin.onNotification(function (data, a, b, c) {
          if (data.wasTapped) {
            //Notification was received on device tray and tapped by the user.
          } else {
            //Notification was received in foreground. Maybe the user needs to be notified.
          }
        });
      }
      /* eslint-enable no-undef */
    });
  });

function DeepLinkHandler (data) {
  console.log('here called....', data);
}
