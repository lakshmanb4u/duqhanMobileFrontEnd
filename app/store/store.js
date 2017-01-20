'use strict';
angular.module('store', [
  'ionic',
  'ngCordova',
  'ui.router',
  'ion-datetime-picker',
  'wu.masonry',
  'ionic.ion.imageCacheFactory'
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
      // cache: false,
      views: {
        'latestProductsContent': {
          templateUrl: 'store/templates/products/products.html'
          // controller: 'ProductsCtrl as ctrl'
        }
      }
    })
    .state('store.products.recent', {
      url: '/recent',
      // cache: false,
      views: {
        'recentProductsContent': {
          templateUrl: 'store/templates/products/products.html'
          // controller: 'ProductsCtrl as ctrl'
        }
      }
    })

    .state('store.product', {
      url: '/product/:productId',
      abstract: true,
      cache: false,
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
          // controller: 'ProductCtrl as ctrl'
        }
      }
    })
    .state('store.product.related', {
      url: '/related',
      views: {
        'relatedProductContent': {
          templateUrl: 'store/templates/product/related.html',
          // controller: 'ProductCtrl as ctrl'
        }
      }
    })
    .state('store.product.description', {
      url: '/description',
      views: {
        'descriptionProductContent': {
          templateUrl: 'store/templates/product/description.html',
          // controller: 'ProductCtrl as ctrl'
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
    .state('store.profile', {
      url: '/profile',
      views: {
        'storeContent': {
          templateUrl: 'store/templates/profile.html',
          controller: 'ProfileCtrl as ctrl'
        }
      }
    })
    .state('store.sizes', {
      url: '/sizes',
      views: {
        'storeContent': {
          templateUrl: 'store/templates/size-chart.html',
          controller: 'SizeChartCtrl as ctrl'
        }
      }
    })
    .state('store.shipping', {
      url: '/shipping',
      views: {
        'storeContent': {
          templateUrl: 'store/templates/shipping.html',
          controller: 'ShippingCtrl as ctrl'
        }
      }
    })
    .state('store.returnpolicy', {
      url: '/return-policy',
      views: {
        'storeContent': {
          templateUrl: 'store/templates/return-policy.html',
          controller: 'ReturnPolicyCtrl as ctrl'
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
