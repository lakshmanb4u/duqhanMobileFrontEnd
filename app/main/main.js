'use strict';
angular.module('main', [
  'ionic',
  'ionic.cloud',
  'ngCordova',
  'ui.router',
  'ngStorage',
  'auth',
  'store',
  'base64'
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
      'app_id': '53b31d77'
    },
    'auth': {
      'facebook': {
        'scope': ['email', 'public_profile']
      }
    }
  });
})
.run(function () {

});
