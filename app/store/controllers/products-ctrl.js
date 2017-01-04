'use strict';
angular.module('store')
.controller('ProductsCtrl', function (
  $log
) {
  var ctrl = this;

  $log.log('Hello from your Controller: ProductsCtrl in module store:. This is your controller:', ctrl);

  ctrl.latestProducts = [1, 2, 3, 4, 5, 6];
  ctrl.recentProducts = [1, 2];

});
