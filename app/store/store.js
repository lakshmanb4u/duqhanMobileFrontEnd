'use strict';
angular.module('store', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
.config(function ($stateProvider, $ionicConfigProvider) {

  // $ionicConfigProvider.tabs.style('striped');
  $ionicConfigProvider.tabs.position('top');

  // ROUTING with ui.router
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('store', {
      url: '/store',
      abstract: true,
      templateUrl: 'store/templates/menu.html',
      controller: 'StoreMenuCtrl as menu'
    })
    .state('store.products', {
      url: '/products',
      abstract: true,
      views: {
        'storeContent': {
          templateUrl: 'store/templates/products/products-tab.html',
          controller: 'ProductsCtrl as ctrl'
        }
      }
    })
    .state('store.products.latest', {
      url: '/latest',
      views: {
        'latestProductsContent': {
          templateUrl: 'store/templates/products/latest.html',
          controller: 'ProductsCtrl as ctrl'
        }
      }
    })
    .state('store.products.recent', {
      url: '/recent',
      views: {
        'recentProductsContent': {
          templateUrl: 'store/templates/products/recent.html',
          controller: 'ProductsCtrl as ctrl'
        }
      }
    })
    .state('store.product', {
      url: '/product',
      abstract: true,
      views: {
        'storeContent': {
          templateUrl: 'store/templates/product/product-tab.html',
          controller: 'ProductCtrl as ctrl'
        }
      }
    })
    .state('store.product.overview', {
      url: '/overview',
      views: {
        'overviewProductContent': {
          templateUrl: 'store/templates/product/overview.html',
          controller: 'ProductCtrl as ctrl'
        }
      }
    })
    .state('store.product.related', {
      url: '/related',
      views: {
        'relatedProductContent': {
          templateUrl: 'store/templates/product/related.html',
          controller: 'ProductCtrl as ctrl'
        }
      }
    })
    .state('store.product.description', {
      url: '/description',
      views: {
        'descriptionProductContent': {
          templateUrl: 'store/templates/product/description.html',
          controller: 'ProductCtrl as ctrl'
        }
      }
    })
    .state('store.cart', {
      url: '/cart',
      views: {
        'storeContent': {
          templateUrl: 'store/templates/cart.html',
          controller: 'CartCtrl as ctrl'
        }
      }
    })


    .state('store.list', {
      url: '/list',
      views: {
        'storeContent': {
          templateUrl: 'store/templates/list.html',
          // controller: '<someCtrl> as ctrl'
        }
      }
    })
    .state('store.listDetail', {
      url: '/list/detail',
      views: {
        'storeContent': {
          templateUrl: 'store/templates/list-detail.html',
          // controller: '<someCtrl> as ctrl'
        }
      }
    })
    .state('store.debug', {
      url: '/debug',
      views: {
        'storeContent': {
          templateUrl: 'store/templates/debug.html',
          controller: 'StoreDebugCtrl as ctrl'
        }
      }
    });
});
