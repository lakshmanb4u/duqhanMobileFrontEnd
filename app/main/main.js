'use strict';
angular.module('main', [
  'ionic',
  'ionic.cloud',
  'ngCordova',
  'ui.router',
  'auth',
  'store'
])
.config(function ($stateProvider, $urlRouterProvider) {

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
.run(function ($location, $ionicAuth) {
  if ($ionicAuth.isAuthenticated()) {
    // $location.path('/store/products/latest');
    // $location.path('/store/product/overview');
  }
});
