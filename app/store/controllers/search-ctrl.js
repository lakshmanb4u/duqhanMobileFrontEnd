'use strict';
angular.module('store')
.controller('SearchCtrl', function ($log, $stateParams, $rootScope, Store) {

  $log.log('Hello from your Controller: SearchCtrl in module store:. This is your controller:', this);

  /* Storing contextual this in a variable for easy access */
  var ctrl = this;
  ctrl.products = [];
  ctrl.searchProduct = function (searchText) {
    /*----------  Storing url parameter (product id) in scope ----------*/
    ctrl.searchText = searchText;
    var productsParam = {name: ctrl.searchText};
    Store.searchProduct(productsParam)
    .then(function (result) {
      ctrl.products = result.data.products;
    })
    .catch(function (response) {
      $log.log(response);
    });
  };

  ctrl.toggleSearchBar = function () {
    $rootScope.searcBarActive = !$rootScope.searcBarActive;
  };

  /*----------  call the function when user is in search result page  ----------*/
  ctrl.searchProduct($stateParams.searchText);
  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    $log.log(toState);
    if (toState.name === 'store.productsSearch') {
      ctrl.searchProduct($stateParams.searchText);
    }
  });

  /*=====  End of call the function when user is in search result page  ======*/
});
