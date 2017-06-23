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
  ctrl.searchProduct = function (searchText) {
    /*----------  Storing url parameter (product id) in scope ----------*/
    ctrl.searchText = searchText;
    var productsParam = {
      start: ctrl.start + (ctrl.page * Config.ENV.PRODUCTS_PER_PAGE),
      limit: Config.ENV.PRODUCTS_PER_PAGE,
      name: ctrl.searchText
    };
    Store.searchProduct(productsParam)
    .then(function (result) {
      /* Randoize items */
      result.data.products.sort(function () {
        return .5 - Math.random();
      });
      ctrl.products = ctrl.products.concat(result.data.products);
      ctrl.page++;
      if (result.data.products.length > 0) {
        ctrl.noMoreItemsAvailable = false;
      }
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
