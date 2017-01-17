'use strict';
angular.module('store')
.controller('ProductsCtrl', function (
  $log,
  $rootScope,
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
    Store.getProducts(productsParam)
    .then(function (response) {
      $log.log(response);
      ctrl.products = response.data;
    })
    .catch(function (response) {
      $log.log(response);
      if (response.data.statusCode === '403') {
        ctrl.responseCB = 'Invalid credential.';
      } else {
        ctrl.responseCB = 'Something went wrong. Please try again.';
      }
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
