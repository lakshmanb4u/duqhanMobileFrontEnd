'use strict';
angular.module('store')
.controller('ProductCtrl', function ($log) {

  var ctrl = this;

  $log.log('Hello from your Controller: ProductCtrl in module store:. This is your controller:', ctrl);

  ctrl.product = {};
  ctrl.product.image = [{
    mediaUrl: 'main/assets/images/dummy-product-1.jpg'
  }, {
    mediaUrl: 'main/assets/images/dummy-product-2.jpg'
  }, {
    mediaUrl: 'main/assets/images/dummy-product-3.jpg'
  }];
  ctrl.relatedProducts = [1, 2, 3, 4, 5, 6];

});
