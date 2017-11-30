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
    Store.getOrderHistory(param)
    .then(function (response) {
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

  ctrl.cancelOrder = function (orderId) {
    var order = {'orderId': orderId};
    $log.log('hi');
    Store.cancelOrd(order)
    .then(function (response) {
      $log.log(response);
      var notification = {};
      notification.type = 'success';
      notification.text = 'Your request has been recieved. We will process it within 7 working days.';
      $rootScope.$emit('setNotification', notification);
    })
    .catch(function (error) {
      $log.log(error);
    });
  };

  ctrl.checkDate = function (deliverdate) {
    if (deliverdate) {
      var deliverdateObj = new Date(deliverdate.replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
      var currentdateObj = new Date();
      var timeDiff = Math.abs(currentdateObj.getTime() - deliverdateObj.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
      if(diffDays <= 7){
        return true;
      }
    }
    return false;
  };

  ctrl.returnOrder = function (orderId){
    $state.go('store.returnOrder', {orderId : orderId});
  };

  ctrl.goBackOrderHistory = function () {
    $state.go('store.orderhistory');
  };

  ctrl.openImageSourceSelector = function () {
      $log.log( ionic.Platform.device() );
      ImageUpload.getImageSource()
        .then( function ( source ) {
          $log.log( source );
          return ImageUpload.getPicture( source );
        } )
        .then( function ( url ) {
          BusyLoader.show();
          return Store.updateProfileImage( url, ctrl.user.id );
        } )
        .then( function ( data ) {
          $log.log( data );
          var res = JSON.parse( data.response );
          $log.log( res );
          ctrl.user.profileImg = res.profileImg;
          Config.ENV.USER.PROFILE_IMG = ctrl.user.profileImg;
          $rootScope.$emit( 'setUserDetailForMenu' );
          BusyLoader.hide();
        } )
        .catch( function ( response ) {
          $log.log( response );
          BusyLoader.hide();
        } );
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
