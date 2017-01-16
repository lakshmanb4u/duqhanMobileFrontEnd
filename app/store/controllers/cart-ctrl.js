'use strict';
angular.module('store')
.controller('CartCtrl', function ($log, Store) {

  var ctrl = this;

  $log.log('Hello from your Controller: CartCtrl in module store:. This is your controller:', ctrl);

  ctrl.cartItems = [1, 2, 3, 4, 5, 6];

  ctrl.cart = {};

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

  ctrl.loadCartItems();

  ctrl.getAvailability = function (num) {
    return new Array(num);
  };
});
