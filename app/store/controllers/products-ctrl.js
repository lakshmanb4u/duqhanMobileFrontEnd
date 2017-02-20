'use strict';
angular.module('store')
.controller('ProductsCtrl', function (
  $log,
  $rootScope,
  $timeout,
  $ImageCacheFactory,
  BusyLoader,
  Store
) {

  /* Storing contextual this in a variable for easy access */

  var ctrl = this;

  $log.log('Hello from your Controller: ProductsCtrl in module store:. This is your controller:', ctrl);

  /*========================================
  =            Get product list            =
  ========================================*/

  /*----------  Initialize products object  ----------*/

  ctrl.products = [];

  /*----------  Get list of products from backend  ----------*/

  ctrl.loadProductList = function (productsParam) {
    var products = [];
    Store.getProducts(productsParam)
    .then(function (response) {
      BusyLoader.show();
      $log.log(response);
      products = response.data.products;
      ctrl.productCategory = response.data.categoryName;
      // return $ImageCacheFactory.Cache(response.data.allImages);
      return;
    })
    .then(function () {
      ctrl.products = products;
      BusyLoader.hide();
    })
    .catch(function (response) {
      $log.log(response);
    });
  };

  /*----------  Get latest products  ----------*/

  ctrl.loadLatestProductList = function () {
    var productsParam = {};
    ctrl.loadProductList(productsParam);
  };

  /*----------  Get recently viewd products  ----------*/

  ctrl.loadRecentlyViewedProductList = function () {
    var productsParam = {isRecent: true};
    ctrl.loadProductList(productsParam);
  };

  /*----------  Get products by category  ----------*/

  ctrl.loadProductListByCategory = function () {
    var productsParam = {categoryId: 11};
    ctrl.loadProductList(productsParam);
  };

  /*----------  call the function at the time of initialization  ----------*/

  ctrl.loadLatestProductList();

  /*----------  Get the latest or recent products depending on which page user is in  ----------*/

  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    ctrl.products = [];
    $log.log('toState:', toState);
    if (toState.name === 'store.products.recent') {
      $log.log('Load recent list');
      ctrl.loadRecentlyViewedProductList();
    } else if (toState.name === 'store.products.latest') {
      $log.log('Load latest list');
      ctrl.loadLatestProductList();
    }
  });

  /*=====  End of Get product list  ======*/

});
