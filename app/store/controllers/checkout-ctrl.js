'use strict';
angular.module('store')
.controller('CheckoutCtrl', function ($rootScope, $scope, $log, $ionicModal, $stateParams, $cordovaInAppBrowser, $state, Store) {

  $log.log('Hello from your Controller: CheckoutCtrl in module store:. This is your controller:', this);

  /* Storing contextual this in a variable for easy access */

  var ctrl = this;


  /*===========================================
  =            Get default address            =
  ===========================================*/

  ctrl.getDefaultAddress = function () {
    Store.getDefaultAddress()
    .then(function (response) {
      $log.log('getDefaultAddress');
      $log.log(response.data.addresses);
      if (response.data.addresses.length > 0) {
        ctrl.address = response.data.addresses[0];
      } else {
        ctrl.address = null;
      }
    })
    .catch(function (error) {
      $log.log(error);
    });
  };

  /*----------  call the function at the time of initialization  ----------*/

  ctrl.getDefaultAddress();

  /*----------  call the function when user is in cart page  ----------*/

  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    $log.log(event);
    if (toState.name === 'store.checkout') {
      ctrl.getDefaultAddress();
    }
  });

  /*=====  End of Get default address  ======*/


  /*----------  Storing cart object  ----------*/

  ctrl.cart = $stateParams.cart;
  ctrl.cart.orderTotal = 0;
  angular.forEach(ctrl.cart.products, function (p) {
    ctrl.cart.orderTotal = ctrl.cart.orderTotal + (p.discountedPrice * p.qty);
  });

  /*===============================================
  =            Change delivery address            =
  ===============================================*/

  ctrl.addressSelectionError = true;

  ctrl.changeAddress = function () {
    Store.getAddresses()
    .then(function (response) {
      ctrl.addresses = response.data.addresses;
      ctrl.modal.show();
    })
    .catch(function (error) {
      $log.log(error);
    });
  };

  ctrl.selectAddress = function () {
    $log.log(ctrl.selectedAddress);
    if (ctrl.selectedAddress) {
      ctrl.address = ctrl.selectedAddress;
      ctrl.closeModal();
    } else {
      ctrl.addressSelectionError = false;
    }
  };

  /*=====  End of Change delivery address  ======*/

  /*=======================================
  =            Payment section            =
  =======================================*/

  ctrl.pay = function () {
    $log.log(ctrl.cart);
    $log.log(ctrl.address);
    ctrl.cart.deliveryAddressId = ctrl.address.addressId;
    ctrl.cart.addressDto = ctrl.address;

    Store.checkout(ctrl.cart)
    .then(function (response) {
      $log.log('response ==');
      $log.log(response.data.status);
      ctrl.payKey = response.data.statusCode;
      var options = {
        EnableViewPortScale: 'yes',
        transitionstyle: 'fliphorizontal',
        toolbarposition: 'top',
        closebuttoncaption: 'BACK',
        location: 'yes'
      };
      return $cordovaInAppBrowser.open(response.data.status, '_blank', options);
    })
    .then(function (event) {
      $log.log(event);
    })
    .catch(function (error) {
      $log.log(error);
    });
  };
  $rootScope.$on('$cordovaInAppBrowser:exit', function (e, event) {
    $log.log('Exited inapp browser');
    $log.log(e);
    $log.log(event);
    ctrl.checkPaymentStatus();
  });

  ctrl.checkPaymentStatus = function () {
    $log.log('checkPaymentStatus');
    $log.log(ctrl.payKey);
    Store.checkPaymentStatus(ctrl.payKey)
    .then(function (response) {
      $log.log(response);
      $rootScope.$emit('getCartTotalNumber');
      $state.go('store.orderhistory');
      var notification = {};
      if (response.data.status === 'approved') {
        notification.type = 'success';
        notification.text = 'Item purchased successfully.';
        $rootScope.$emit('setNotification', notification);
      } else {
        notification.type = 'failure';
        notification.text = 'Something went wrong. Please try again.';
      }

    })
    .catch(function (error) {
      $log.log(error);
    });
  };

  /*=====  End of Payment section  ======*/


  /*===============================================
  =            Modal related functions            =
  ===============================================*/

  $ionicModal.fromTemplateUrl('select-address-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  })
  .then( function (modal) {
    ctrl.modal = modal;
  });

  ctrl.closeModal = function () {
    ctrl.modal.hide();
  };

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    ctrl.modal.remove();
  });

  /*=====  End of Modal related functions  ======*/

});
