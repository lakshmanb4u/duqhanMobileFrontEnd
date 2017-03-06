'use strict';
angular.module('main', [
  'ionic',
  'ionic.cloud',
  'ngCordova',
  'ui.router',
  'ngStorage',
  'auth',
  'store'
])
.config(function ($stateProvider, $urlRouterProvider) {

  // $httpProvider.interceptors.push('HttpInterceptor');
  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/landing');
})
 // ADD: initialize $ionicCloudProvider with app_id
.config(function ($ionicCloudProvider) {
  $ionicCloudProvider.init({
    'core': {
      'app_id': 'ad64e5e2'
    },
    'auth': {
      'facebook': {
        'scope': ['email', 'public_profile']
      }
    }
  });
})
.run(function ($ionicPlatform, $log, $rootScope) {
  $ionicPlatform.ready( function () {
    $log.log('Device details==================');
    $log.log(ionic.Platform.platform());
    $log.log(ionic.Platform.device());
    $log.log(ionic.Platform.version());
    $log.log(ionic.Platform.ua);
    if (window.cordova) {
      // eslint-disable-next-line no-undef
      FCMPlugin.onNotification( function (data) {
        $log.log(data);
        if (data.wasTapped) {
          $log.log('Notification was received on device tray and tapped by the user.');
          $log.log(JSON.stringify(data));
        } else {
          $log.log('Notification was received in foreground. Maybe the user needs to be notified.');
          $log.log(JSON.stringify(data));
        }
        if (data.payment && data.payment === 'Done') {
          $rootScope.$emit('closeCordovaInAppBrowser');
        }
      });
      window.cordova.plugins.firebase.crash.report('BOOM! Testing crash report');
    }
  });
});
