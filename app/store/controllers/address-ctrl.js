'use strict';
angular.module('store')
.controller('AddressCtrl', function ($rootScope, $scope, $log, $ionicModal, $ionicPopover, Store) {

  $log.log('Hello from your Controller: AddressCtrl in module store:. This is your controller:', this);

  /* Storing contextual this in a variable for easy access */

  var ctrl = this;

  /*----------  Initialize addresses object  ----------*/

  ctrl.addresses = {};

  /*==============================================
  =            List all the addresses            =
  ==============================================*/

  ctrl.loadAddresses = function () {
    Store.getAddresses()
    .then(function (response) {
      ctrl.addresses = response.data.addresses;
    })
    .catch(function (error) {
      $log.log(error);
    });
  };

  /*----------  call the function at the time of initialization  ----------*/

  ctrl.loadAddresses();

  /*----------  call the function when user is in cart page  ----------*/

  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    $log.log(event);
    if (toState.name === 'store.myaddress') {
      ctrl.loadAddresses();
    }
  });

  /*=====  End of List all the addresses  ======*/


  /*===================================
  =            Add address            =
  ===================================*/

  ctrl.addAddress = function (fromCheckout) {
    ctrl.addressDTO = {};
    ctrl.addressDTO.addressId = null;
    ctrl.addressDTO.status = true;
    if (fromCheckout) {
      ctrl.addressDTO.fromCheckout = fromCheckout;
    }
    ctrl.modal.show();
  };

  ctrl.saveAddress = function () {
    if (ctrl.addAddressForm.$valid) {
      $log.log(ctrl.addressDTO);
      ctrl.addressDTO.status = ctrl.addressDTO.status ? 1 : 2;
      Store.saveAddress(ctrl.addressDTO)
      .then(function (response) {
        $log.log(response);
        if (ctrl.addressDTO.fromCheckout) {
          $rootScope.$emit('setTempAddressForCheckout', response.data.addresses[0]);
        } else {
          ctrl.loadAddresses();
        }
        ctrl.closeModal();
      })
      .catch(function (error) {
        $log.log(error);
      });
    }
  };

  // Catching calls from outside this controller
  $rootScope.$on('addAddress', function (event, fromCheckout) {
    $log.log(event);
    $log.log('on addAddress');
    ctrl.addAddress(fromCheckout);
  });

  /*=====  End of Add address  ======*/

  /*===========================================
  =            Set default address            =
  ===========================================*/

  ctrl.setDefaultAddress = function () {
    $log.log(ctrl.popover.address);
    ctrl.closeAddressOptions();
    Store.setDefaultAddress(ctrl.popover.address.addressId)
    .then(function (response) {
      $log.log(response);
      ctrl.loadAddresses();
    })
    .catch(function (error) {
      $log.log(error);
    });
  };

  /*=====  End of Set default address  ======*/

  /*====================================
  =            Edit address            =
  ====================================*/

  ctrl.openEditAddressModal = function () {
    ctrl.closeAddressOptions();
    ctrl.addressDTO = ctrl.popover.address;
    ctrl.addressDTO.phone = Number(ctrl.addressDTO.phone);
    ctrl.addressDTO.zipCode = Number(ctrl.addressDTO.zipCode);
    ctrl.addressDTO.status = ctrl.addressDTO.status === 1 ? true : false;
    ctrl.modal.show();
  };

  /*=====  End of Edit address  ======*/

  /*======================================
  =            Remove address            =
  ======================================*/

  ctrl.removeAddress = function () {
    ctrl.closeAddressOptions();
    Store.deactivateAddress(ctrl.popover.address.addressId)
    .then(function (response) {
      $log.log(response);
      ctrl.loadAddresses();
    })
    .catch(function (error) {
      $log.log(error);
    });
  };

  /*=====  End of Remove address  ======*/


  /*===============================================
  =            Modal related functions            =
  ===============================================*/

  $ionicModal.fromTemplateUrl('store/templates/my-address-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  })
  .then( function (modal) {
    ctrl.modal = modal;
  });

  ctrl.closeModal = function () {
    ctrl.closeAddressOptions();
    ctrl.modal.hide();
  };

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    ctrl.modal.remove();
  });

  /*=====  End of Modal related functions  ======*/

  /*===============================
  =            Popover            =
  ===============================*/

  $ionicPopover.fromTemplateUrl('address-options-popover.html', {
    scope: $scope,
  }).then(function (popover) {
    ctrl.popover = popover;
    ctrl.popover.address = {};
  });

  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function () {
    ctrl.popover.remove();
  });

  ctrl.closeAddressOptions = function () {
    if (ctrl.popover) {
      ctrl.popover.hide();
    }
  };

  ctrl.openAddressOptions = function ($event, address) {
    ctrl.popover.show($event);
    ctrl.popover.address = address;
  };

  /*=====  End of Popover  ======*/

});
