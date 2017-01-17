'use strict';
angular.module('store')
.controller('CartCtrl', function ($log, $rootScope, Store) {

  /* Storing contextual this in a variable for easy access */

  var ctrl = this;

  $log.log('Hello from your Controller: CartCtrl in module store:. This is your controller:', ctrl);

  /*============================================
  =            show cart page items            =
  ============================================*/

  /*----------  Initialize cart object  ----------*/

  ctrl.cart = {};

  /*----------  Get items in cart from backend  ----------*/

  ctrl.loadCartItems = function () {
    Store.getCart()
    .then(function (response) {
      $log.log(response.data);
      ctrl.cart = response.data;
    })
    .catch(function (response) {
      $log.log(response);
    });
  };

  /*----------  call the function at the time of initialization  ----------*/

  ctrl.loadCartItems();

  /*----------  call the function when user is in cart page  ----------*/

  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    $log.log(event);
    if (toState.name === 'store.cart') {
      ctrl.loadCartItems();
    }
  });

  /*=====  End of Get product list  ======*/

  /*----------  Helping function to create the dropdown of quantity in the cart page  ----------*/

  ctrl.getAvailability = function (num) {
    return new Array(num);
  };

  /*=====  End of show cart page items  ======*/
});
