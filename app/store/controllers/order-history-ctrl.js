'use strict';
angular.module('store')
.controller('OrderHistoryCtrl', function ($log, $rootScope, $stateParams, Store) {

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
  // ctrl.order = {
  //   userId: null,
  //   paymentKey: 'PAY-6CT16779JM531535BLCFUJXA',
  //   mapId: 3,
  //   paymentAmount: 400.0,
  //   price: 450.0,
  //   discount: 11.11,
  //   orderDate: '27/01/2017',
  //   status: 'created',
  //   productName: 'T Shirts',
  //   color: 'Blue',
  //   size: 'M',
  //   deliveryDate: null,
  //   phone: '8013475458',
  //   email: null,
  //   prodImg: 'http://res.cloudinary.com/duqhan/image/upload/v1484226413/test/T%20Shirts.jpg',
  //   addressDto: {
  //     addressId: 1,
  //     userId: 4,
  //     status: 2,
  //     streetOne: '50, Subodh Garden',
  //     streetTwo: 'Bansdroni',
  //     city: 'Kolkata',
  //     state: 'West Bengal',
  //     zipCode: '700075',
  //     country: null,
  //     isResidential: true,
  //     contactName: 'Jayanta Kar',
  //     companyName: null,
  //     phone: '8013475458',
  //     email: null
  //   }
  // };

});
