'use strict';
angular.module('store')
.controller('OrderHistoryCtrl', function ($log, $rootScope, $stateParams, $scope, Store) {

  $log.log('Hello from your Controller: OrderHistoryCtrl in module store:. This is your controller:', this);

  /* Storing contextual this in a variable for easy access */

  var ctrl = this;

  /*=========================================
  =            Get order history            =
  =========================================*/

  ctrl.getOrderHistory = function () {
    Store.getOrderHistory()
    .then(function (response) {
      $log.log('getOrderHistory');
      $log.log(response.data.orderDetailsDtos);
      if (response.data.orderDetailsDtos.length > 0) {
        ctrl.orders = response.data.orderDetailsDtos;
      } else {
        ctrl.orders = null;
      }
    })
    .catch(function (error) {
      $log.log(error);
    });
  };

  ctrl.cancelOrder = function (orderId) {
    var order = {'orderId': orderId};
    $log.log('hi');
    Store.cancelOrd(order)
    .then(function (response) {
      $log.log(response);
      var notification = {};
      notification.type = 'success';
      notification.text = 'We will process in next 7 working days';
      $rootScope.$emit('setNotification', notification);
    })
    .catch(function (error) {
      $log.log(error);
    });
  };

  /*----------  call the function at the time of initialization  ----------*/

  ctrl.getOrderHistory();

  /*----------  call the function when user is in cart page  ----------*/

  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    $log.log(event);
    if (toState.name === 'store.orderhistory') {
      ctrl.getOrderHistory();
    }
  });

  /*=====  End of Get order history  ======*/

  /*----------  Storing Order object  ----------*/

  ctrl.order = $stateParams.order;

});
