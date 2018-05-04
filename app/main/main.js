'use strict';
angular
  .module('main', [
    'ionic',
    'ionic.cloud',
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
    Crashlytics.logException("my caught Exception");
    // sample index.js
  })
  /*.config(function (FacebookProvider) {
    FacebookProvider.init('698576100317336');
  })*/
  .config(function ($ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  })
  .run(function ($ionicPlatform, $log, $rootScope, $state, $localStorage ,$location) {
    var app = {
      initialize: function() {
        console.log("in initialize");
        this.bindEvents();
      },
      bindEvents: function() {
        console.log("in bindEvents");
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('resume', this.onDeviceResume, false);
      },
      onDeviceReady: function() {
        console.log("in onDeviceReady");
        app.handleBranch();
      },
      onDeviceResume: function() {
        console.log("in onDeviceResume");
        app.handleBranch();
      },
      handleBranch: function() {
        // Branch initialization
        console.log("in handleBranch");
        Branch.initSession().then(function(data) {
          if (data['+clicked_branch_link']) {
            // read deep link data on click
            console.log("depp link",data);
            //$state.go('store.product', {'productId': 67702 })
            location.href = data.$android_url;
          }
        });
      }
    };
    console.log("------------------>app initialization");
    app.initialize();
    if (angular.isUndefined($localStorage.savedUser)) {
      var obj ={
        email :'guest@gmail.com',
        password :'dukhan123',
        name :'Guest User',
        authtoken :'dukhan123'
      }
      $localStorage.savedUser =  JSON.stringify(obj); 
    }
    $rootScope.$state = $state;
    $ionicPlatform.ready(function () {
      /* eslint-disable no-undef */
      if (window.cordova) {
        try {
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
        FCMPlugin.onNotification(function(data,a,b,c){
          if(data.wasTapped){
            //Notification was received on device tray and tapped by the user.
          }else{
            //Notification was received in foreground. Maybe the user needs to be notified.
          }
        });
      }
      /* eslint-enable no-undef */
    });
  });

  function DeepLinkHandler(data){
    console.log('here called....',data);
  }