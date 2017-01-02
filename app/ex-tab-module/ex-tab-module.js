'use strict';
angular.module('exTabModule', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
.config(function ($stateProvider) {

  // ROUTING with ui.router
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('exTabModule', {
      url: '/ex-tab-module',
      abstract: true,
      templateUrl: 'ex-tab-module/templates/tabs.html'
    })
      .state('exTabModule.list', {
        url: '/list',
        views: {
          'tab-list': {
            templateUrl: 'ex-tab-module/templates/list.html',
            // controller: 'SomeCtrl as ctrl'
          }
        }
      })
      .state('exTabModule.listDetail', {
        url: '/list/detail',
        views: {
          'tab-list': {
            templateUrl: 'ex-tab-module/templates/list-detail.html',
            // controller: 'SomeCtrl as ctrl'
          }
        }
      })
      .state('exTabModule.debug', {
        url: '/debug',
        views: {
          'tab-debug': {
            templateUrl: 'ex-tab-module/templates/debug.html',
            controller: 'ExTabModuleDebugCtrl as ctrl'
          }
        }
      });
});
