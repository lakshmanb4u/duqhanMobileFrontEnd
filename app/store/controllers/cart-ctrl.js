'use strict';
angular.module('store')
.controller('CartCtrl', function ($log, $rootScope, $cordovaInAppBrowser, Store, Common) {

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

  /*----------  Get shipping total  ----------*/

  ctrl.getShippingTotal = function () {
    var cartShippingTotal = 0;
    angular.forEach(ctrl.cart.products, function (item) {
      cartShippingTotal += item.shippingRate;
    });
    return cartShippingTotal;
  };

  /*----------  Get item total (calculate this manually so that we can change it when user change the quantity)  ----------*/

  ctrl.getCartItemTotal = function () {
    var cartItemTotal = 0;
    angular.forEach(ctrl.cart.products, function (item) {
      cartItemTotal += item.price * item.qty;
    });
    return cartItemTotal;
  };

  /*----------  Get order total (calculate this manually so that we can change it when user change the quantity)  ----------*/

  ctrl.getOrderTotal = function () {
    var cartorderTotal = 0;
    angular.forEach(ctrl.cart.products, function (item) {
      cartorderTotal += item.discountedPrice * item.qty;
    });
    return cartorderTotal + ctrl.getShippingTotal();
  };

  /*----------  Get discount total (calculate this manually so that we can change it when user change the quantity)  ----------*/

  ctrl.getDiscountTotal = function () {
    var cartItemTotal = 0, cartorderTotal = 0;
    angular.forEach(ctrl.cart.products, function (item) {
      cartItemTotal += item.price * item.qty;
      cartorderTotal += item.discountedPrice * item.qty;
    });
    return (cartItemTotal - cartorderTotal);
  };

  /*----------  Get discount percentage (calculate this manually so that we can change it when user change the quantity)  ----------*/

  ctrl.getDiscountPctTotal = function () {
    var cartItemTotal = 0, cartorderTotal = 0;
    angular.forEach(ctrl.cart.products, function (item) {
      cartItemTotal += item.price * item.qty;
      cartorderTotal += item.discountedPrice * item.qty;
    });
    return ((cartItemTotal - cartorderTotal) / cartItemTotal) * 100;
  };

  /*=====  End of show cart page items  ======*/

  /*========================================
  =            Remove from cart            =
  ========================================*/

  ctrl.removeFromCart = function (p) {
    $log.log(p);
    var title = 'Are you sure?', cancelText = 'No', okText = 'Yes';
    Common.getConfirmation(title, cancelText, okText)
    .then(function (response) {
      if (response) {
        var item = {};
        item.cartId = p.cartId;
        item.mapId = p.sizeColorMapId;

        Store.removeFromCart(item)
        .then(function (response) {
          $log.log(response.data);
          $rootScope.$emit('getCartTotalNumber');
          var notification = {};
          notification.type = 'success';
          notification.text = 'Item removed successfully';
          $rootScope.$emit('setNotification', notification);
          ctrl.loadCartItems();
        })
        .catch(function (response) {
          $log.log(response);
        });
      }
    })
    .catch(function (response) {
      $log.log(response);
    });

  };

  /*=====  End of Remove from cart  ======*/

  ctrl.testBrowser = function () {
    $log.log('hello');
    var options = {
      EnableViewPortScale: 'yes',
      transitionstyle: 'fliphorizontal',
      toolbarposition: 'top',
      closebuttoncaption: 'BACK',
      location: 'yes'
    };
    $cordovaInAppBrowser.open('http://www.google.com/', '_blank', options)
    .then(function (event) {
      $log.log(event);
    })
    .catch(function (event) {
      $log.log(event);
    });
  };

});
