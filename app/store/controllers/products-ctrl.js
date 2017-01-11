'use strict';
angular.module('store')
.controller('ProductsCtrl', function (
  $log,
  $rootScope,
  Store
) {
  var ctrl = this;

  $log.log('Hello from your Controller: ProductsCtrl in module store:. This is your controller:', ctrl);

  ctrl.latestProducts = [1, 2, 3, 4, 5, 6];
  ctrl.recentProducts = [1, 2];

  ctrl.products = [];

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

  ctrl.loadLatestProductList = function () {
    var productsParam = {};
    ctrl.loadProductList(productsParam);
  };

  ctrl.loadRecentlyViewedProductList = function () {
    var productsParam = {isRecent: true};
    ctrl.loadProductList(productsParam);
  };

  ctrl.loadProductListByCategory = function () {
    var productsParam = {categoryId: 11};
    ctrl.loadProductList(productsParam);
  };

  // Load latest products at the time of controller initialization
  ctrl.loadLatestProductList();

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

});
