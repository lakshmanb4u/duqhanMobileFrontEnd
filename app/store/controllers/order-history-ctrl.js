'use strict';
angular.module('store')
.controller('OrderHistoryCtrl', function ($log, $rootScope, $stateParams, $state, $scope, Store, Config, ImageUpload, BusyLoader) {

  $log.log('Hello from your Controller: OrderHistoryCtrl in module store:. This is your controller:', this);

  /* Storing contextual this in a variable for easy access */

  var ctrl = this;
  ctrl.orders = [];
  ctrl.start = 0;
  ctrl.page = 0;
  ctrl.noMoreItemsAvailable = false;

  /*=========================================
  =            Get order history            =
  =========================================*/

  ctrl.getOrderHistory = function () {
    var param = {
      start: ctrl.start + (ctrl.page * Config.ENV.PRODUCTS_PER_PAGE),
      limit: Config.ENV.PRODUCTS_PER_PAGE,
    };
    var s = new Date().getTime();
    Store.getOrderHistory(param)
    .then(function (response) {
      var e = new Date().getTime();
      var t = e-s;
      Store.awsCloudWatch('JS Mob Get order details','JS Mob get-order-details',t);
      ctrl.orders = ctrl.orders.concat(response.data.orderDetailsDtos);
      ctrl.page++;
      if (response.data.orderDetailsDtos > 0) {
        ctrl.noMoreItemsAvailable = false;
      }
    })
    .catch(function (error) {
      $log.log(error);
    });
  };

  ctrl.cancelOrder = function (order) {
    var orderObj = {'orderId': order.orderId};
    var s = new Date().getTime();
    Store.cancelOrd(orderObj)
    .then(function (response) {
      var e = new Date().getTime();
      var t = e-s;
      Store.awsCloudWatch('JS Mob Cancel order','JS Mob cancel-order',t);
      $log.log(response);
      var notification = {};
      notification.type = 'success';
      notification.text = 'Your order has been cancelled';
      $rootScope.$emit('setNotification', notification);
    })
    .catch(function (error) {
      $log.log(error);
    });
  };

  ctrl.checkDate = function (deliverdate) {
    if (deliverdate) {
      var deliverdateObj = new Date(deliverdate.replace( /(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
      var currentdateObj = new Date();
      var timeDiff = Math.abs(currentdateObj.getTime() - deliverdateObj.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (diffDays <= 7) {
        return true;
      }
    }
    return false;
  };

  ctrl.returnOrder = function (orderId) {
    $state.go('store.returnOrder', { orderId: orderId});
  };

  ctrl.goBackOrderHistory = function () {
    $state.go('store.orderhistory');
  };

  ctrl.returnImg = undefined;
  ctrl.openImageSourceSelector = function () {
    $log.log(ionic.Platform.device());
    ImageUpload.getImageSource()
      .then( function ( source ) {
        $log.log( source );
        return ImageUpload.getPicture( source );
      } )
      .then( function ( url ) {
        $log.log(url);
        ctrl.returnImg = url;
      })
      .catch( function ( response ) {
        $log.log( response );
      } );
  };

  ctrl.returnOrderReq = function () {
    if (ctrl.returnImg) {
      BusyLoader.show();
      Store.returnOrderReq(ctrl.returnImg,$stateParams.orderId,ctrl.returnIssue,Config.ENV.USER.AUTH_TOKEN).then(function (response) {
        $log.log(response);
        BusyLoader.hide();
        $state.go('store.orderhistory');
      })
      .catch(function (response) {
        $log.log(response);
        BusyLoader.hide();
      });
    }
  };

  /*----------  call the function at the time of initialization  ----------*/

  ctrl.getOrderHistory();

  /*----------  Load more products  ----------*/
  ctrl.loadMore = function () {
    if (!ctrl.noMoreItemsAvailable) {
      ctrl.noMoreItemsAvailable = true;
      $scope.$broadcast('scroll.infiniteScrollComplete');
      if ($state.current.name === 'store.orderhistory') {
        ctrl.getOrderHistory();
      }
    }
  };

  /*----------  call the function when user is in cart page  ----------*/

  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    ctrl.orders = [];
    ctrl.start = 0;
    ctrl.page = 0;
    ctrl.noMoreItemsAvailable = false;
    if (toState.name === 'store.orderhistory') {
      ctrl.getOrderHistory();
    }
  });

  /*=====  End of Get order history  ======*/

  /*----------  Storing Order object  ----------*/

  ctrl.order = $stateParams.order;
});
