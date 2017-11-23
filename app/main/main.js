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
    'jkAngularRatingStars'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    // $httpProvider.interceptors.push('HttpInterceptor');
    // ROUTING with ui.router
    $urlRouterProvider.otherwise('/landing');
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
  })
  .config(function ($ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  })
  .run(function ($ionicPlatform, $log, $rootScope, $state) {
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
      }

      /* eslint-enable no-undef */
    });
  });
