'use strict';
angular.module('store')
.controller('CartCtrl', function ($log) {

  var ctrl = this;

  $log.log('Hello from your Controller: CartCtrl in module store:. This is your controller:', ctrl);

  ctrl.cartItems = [1, 2, 3, 4, 5, 6];

});
