'use strict';
angular.module('store')
.controller('SearchCtrl', function ($log, $stateParams, $scope, $rootScope, $state, Store, Config) {

  $log.log('Hello from your Controller: SearchCtrl in module store:. This is your controller:', this);

  /* Storing contextual this in a variable for easy access */
  var ctrl = this;
  ctrl.products = [];
  ctrl.start = 0;
  ctrl.page = 0;
  ctrl.noMoreItemsAvailable = false;
  ctrl.searchNotFound = false;
  ctrl.searchProduct = function (searchText) {
    /*----------  Storing url parameter (product id) in scope ----------*/
    ctrl.searchText = searchText;
    var productsParam = {
      start: ctrl.start + (ctrl.page * Config.ENV.PRODUCTS_PER_PAGE),
      limit: Config.ENV.PRODUCTS_PER_PAGE,
      name: ctrl.searchText
    };
    var s = new Date().getTime();
    Store.searchProduct(productsParam)
    .then(function (result) {
      /* Randoize items */
      var e = new Date().getTime();
      var t = e-s;
      Store.awsCloudWatch('JS Mob Search product','JS Mob search-product',t);
      result.data.products.sort(function () {
        return .5 - Math.random();
      });
      ctrl.products = ctrl.products.concat(result.data.products);
      if (ctrl.products.length == 0){
        ctrl.searchNotFound = true;
      }
      ctrl.page++;
      if (result.data.products.length > 0) {
        ctrl.noMoreItemsAvailable = false;
      }
      var productsIds = [];
      for (var i = 0; i < 5 && i < ctrl.products.length; i++) {
        productsIds.push(ctrl.products[i].productId);
      }
      console.log('productsIds--->', productsIds)
      /*facebook pixel code*/
          !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ?
          n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s)
    }(window, document, 'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1612756512132293');
    fbq('track', 'Search', {
            search_string: ctrl.searchText,
            content_ids: productsIds,
          });
  /*facebook pixel code End*/
    })
    .catch(function (response) {
      $log.log(response);
    });
  };

  ctrl.toggleSearchBar = function () {
    $rootScope.searcBarActive = !$rootScope.searcBarActive;
  };

  /*----------  Load more products  ----------*/
  ctrl.loadMore = function () {
    if (!ctrl.noMoreItemsAvailable) {
      ctrl.noMoreItemsAvailable = true;
      $scope.$broadcast('scroll.infiniteScrollComplete');
      if ($state.current.name === 'store.productsSearch') {
        ctrl.searchProduct($stateParams.searchText);
      }
    }
  };

  /*----------  call the function when user is in search result page  ----------*/
  ctrl.searchProduct($stateParams.searchText);
  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    ctrl.products = [];
    ctrl.start = 0;
    ctrl.page = 0;
    ctrl.noMoreItemsAvailable = false;
    if (toState.name === 'store.productsSearch') {
      ctrl.searchProduct($stateParams.searchText);
    }
  });

  /*=====  End of call the function when user is in search result page  ======*/
});
