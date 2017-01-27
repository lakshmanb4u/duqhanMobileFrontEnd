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

  ctrl.addAddress = function () {
    ctrl.modal.show();
  };

  ctrl.saveAddress = function () {
    if (ctrl.addAddressForm.$valid) {
      $log.log(ctrl.addressDTO);
      ctrl.addressDTO.addressId = null;
      ctrl.addressDTO.status = 2;
      Store.saveAddress(ctrl.addressDTO)
      .then(function (response) {
        $log.log(response);
        ctrl.closeModal();
      })
      .catch(function (error) {
        $log.log(error);
      });
    }
  };

  /*=====  End of Add address  ======*/

  /*===============================================
  =            Modal related functions            =
  ===============================================*/

  $ionicModal.fromTemplateUrl('new-address-modal.html', {
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

  /*===============================
  =            Popover            =
  ===============================*/

  $ionicPopover.fromTemplateUrl('address-options-popover.html', {
    scope: $scope,
  }).then(function (popover) {
    ctrl.popover = popover;
  });

  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.popover.remove();
  });

  ctrl.openAddressOptions = function ($event) {
    ctrl.popover.show($event);
  };

  /*=====  End of Popover  ======*/

});
