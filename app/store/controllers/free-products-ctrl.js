'use strict';
angular.module('store')
  .controller('FreeProductsCtrl', function ($log, $ionicSlideBoxDelegate, $ionicModal, $scope, BusyLoader, Store) {

    $log.log('Hello from your Controller: FreeProductCtrl in module store:. This is your controller:', this);

    /* Storing contextual this in a variable for easy access */
    var ctrl = this;

    /*========================================
    =         Get free product list          =
    ========================================*/

    /*----------  Initialize products object  ----------*/
    ctrl.products = [];

    /*----------  Get list of free products from backend  ----------*/
    ctrl.loadFreeProductList = function () {
      if (ctrl.products.length === 0) {
        BusyLoader.show();
      }
      var products = [];
      ctrl.showStatus = false;
      Store.getFreeProducts()
        .then(function (response) {
          $log.log(response);
          products = response.data.products;
          ctrl.status = response.data.status;
          ctrl.showStatus = true;
          return;
        })
        .then(function () {
          /* Randoize items */
          if (products && products.length > 0) {
            products.sort(function () {
              return .5 - Math.random();
            });
            ctrl.products = products;
          }
          BusyLoader.hide();
        })
        .catch(function (response) {
          $log.log(response);
          BusyLoader.hide();
        });
    };

    /*========================================
    =         Get free product list end      =
    ========================================*/

    /*==================================================
    Section: Initialization
    ==================================================*/

    ctrl.loadFreeProductList();

    /*==================================================
    End: Initialization
    ==================================================*/

  });
