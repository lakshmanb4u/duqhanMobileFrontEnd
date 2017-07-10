'use strict';
angular
  .module( 'store' )
  .controller( 'CheckoutCtrl', function (
    $rootScope,
    $scope,
    $log,
    $ionicModal,
    $stateParams,
    $cordovaInAppBrowser,
    $state,
    Store
  ) {
    $log.log(
      'Hello from your Controller: CheckoutCtrl in module store:. This is your controller:',
      this
    );

    /* Storing contextual this in a variable for easy access */

    var ctrl = this;

    /*----------  Storing cart object  ----------*/

    ctrl.cart = $stateParams.cart;
    ctrl.cart.orderTotal = 0;
    ctrl.cart.shippingTotal = 0;
    angular.forEach( ctrl.cart.products, function ( p, itr ) {
      if ( p.available ) {
        ctrl.cart.orderTotal = ctrl.cart.orderTotal + p.discountedPrice * p.qty;
        ctrl.cart.shippingTotal = ctrl.cart.shippingTotal + p.shippingRate;
      } else {
        ctrl.cart.products.splice( itr, 1 );
      }
    } );
    // angular.forEach(ctrl.cart.products, function (p) {
    //   ctrl.cart.shippingTotal = ctrl.cart.shippingTotal + p.shippingRate;
    // });
    ctrl.cart.orderTotalWithShipping =
      ctrl.cart.orderTotal + ctrl.cart.shippingTotal;

    /*===========================================
    =            Get default address            =
    ===========================================*/

    ctrl.getDefaultAddress = function () {
      Store.getDefaultAddress()
        .then( function ( response ) {
          $log.log( 'getDefaultAddress' );
          $log.log( response.data.addresses );
          if ( response.data.addresses.length > 0 ) {
            ctrl.address = response.data.addresses[ 0 ];
            /* calling the shipping detail function to get the shipping cost with this delivery address */
            ctrl.cart.deliveryAddressId = response.data.addresses[ 0 ].addressId;
            ctrl.getShippingDetails( ctrl.cart );
          } else {
            ctrl.address = null;
          }
        } )
        .catch( function ( error ) {
          $log.log( error );
        } );
    };

    /*=====  End of Get default address  ======*/

    /*======================================================
    =            Get the shipping cost and time            =
    ======================================================*/

    ctrl.getShippingDetails = function ( cart ) {
      $log.log( cart );
      Store.getShippingDetails( cart )
        .then( function ( response ) {
          $log.log( 'getShippingDetails' );
          $log.log( response.data );
          var tempCart = response.data;
          var orderTotal = ctrl.cart.orderTotal;
          var shippingTotal = 0;
          angular.forEach( tempCart.products, function ( p, i ) {
            orderTotal = orderTotal + p.shippingRate;
            shippingTotal = shippingTotal + p.shippingRate;
            ctrl.cart.products[ i ].shippingRate = p.shippingRate;
            ctrl.cart.products[ i ].shippingTime = p.shippingTime;
          } );
          ctrl.cart.orderTotalWithShipping = orderTotal;
          ctrl.cart.shippingTotal = shippingTotal;
        } )
        .catch( function ( error ) {
          $log.log( error );
        } );
    };

    /*=====  End of Get the shipping cost and time  ======*/

    /*----------  call the function at the time of initialization  ----------*/

    ctrl.getDefaultAddress();

    /*----------  call the function when user is in cart page  ----------*/

    $rootScope.$on( '$stateChangeSuccess', function ( event, toState ) {
      $log.log( event );
      if ( toState.name === 'store.checkout' ) {
        ctrl.getDefaultAddress();
      }
    } );

    /*===============================================
    =            Change delivery address            =
    ===============================================*/

    ctrl.addressSelectionError = true;

    ctrl.changeAddress = function () {
      Store.getAddresses()
        .then( function ( response ) {
          ctrl.addresses = response.data.addresses;
          ctrl.modal.show();
        } )
        .catch( function ( error ) {
          $log.log( error );
        } );
    };

    ctrl.selectAddress = function () {
      $log.log( ctrl.selectedAddress );
      if ( ctrl.selectedAddress ) {
        ctrl.address = ctrl.selectedAddress;
        /* calling the shipping detail function to get the shipping cost with this delivery address */
        ctrl.cart.deliveryAddressId = ctrl.address.addressId;
        ctrl.getShippingDetails( ctrl.cart );
        ctrl.closeModal();
      } else {
        ctrl.addressSelectionError = false;
      }
    };

    ctrl.addAddress = function () {
      ctrl.closeModal();
      $rootScope.$emit( 'addAddress', true );
      // $state.go('store.myaddress');
    };

    ctrl.setTempAddressForCheckout = function ( address ) {
      ctrl.address = address;
      /* calling the shipping detail function to get the shipping cost with this delivery address */
      ctrl.cart.deliveryAddressId = ctrl.address.addressId;
      ctrl.getShippingDetails( ctrl.cart );
    };

    // Catching calls from outside this controller
    $rootScope.$on( 'setTempAddressForCheckout', function ( event, address ) {
      $log.log( event );
      $log.log( 'on setTempAddressForCheckout' );
      ctrl.setTempAddressForCheckout( address );
    } );

    /*=====  End of Change delivery address  ======*/

    /*=======================================
    =            Payment section            =
    =======================================*/

    ctrl.selectPaymentGateway = function () {
      ctrl.cart.paymentGateway = 2;
      ctrl.paymentGatewayModal.show();
    };

    ctrl.pay = function () {
      $log.log( ctrl.cart );
      $log.log( ctrl.address );
      ctrl.closePaymentGatewayModal();
      if ( !ctrl.address ) {
        var notification = {};
        notification.type = 'failure';
        notification.text = 'Please select a delivery address';
        $rootScope.$emit( 'setNotification', notification );
        return;
      }
      ctrl.cart.deliveryAddressId = ctrl.address.addressId;
      ctrl.cart.addressDto = ctrl.address;

      Store.checkout( ctrl.cart )
        .then( function ( response ) {
          $log.log( 'response ==' );
          $log.log( response.data.status );
          ctrl.payKey = response.data.statusCode;
          var browserOptions = {
            EnableViewPortScale: 'yes',
            transitionstyle: 'fliphorizontal',
            toolbarposition: 'top',
            closebuttoncaption: 'BACK',
            location: 'no'
          };
          $cordovaInAppBrowser.open(
            response.data.paymentUrl,
            '_blank',
            browserOptions
          );
          if ( ctrl.cart.paymentGateway === 2 ) {
            var script = '';
            var options = response.data.parameters;
            for ( var key in options ) {
              if ( options.hasOwnProperty( key ) ) {
                $log.log( key + ' -> ' + options[ key ] );
                script +=
                  'document.getElementById("' +
                  key +
                  '").value="' +
                  options[ key ] +
                  '";';
              }
            }
            script += 'document.getElementById("paytmForm").submit();';

            $rootScope.$on( '$cordovaInAppBrowser:loadstop', function ( e, event ) {
              $log.log( 'loadstop' );
              $log.log( script );
              if ( event.url.indexOf( response.data.paymentUrl ) === 0 ) {
                // insert Javascript via code / file
                $cordovaInAppBrowser.executeScript( {
                  code: script
                } );
              }
            } );
          }
        } )
        .catch( function ( error ) {
          $log.log( error );
        } );
    };

    $rootScope.$on( '$cordovaInAppBrowser:loadstop', function ( e, event ) {
      $log.log( 'Current url=============================' );
      $log.log( event.url );
      if (
        event.url.indexOf( '/to-be-redirected' ) > 0 ||
        event.url.indexOf( '/to-be-canceled' ) > 0 ||
        event.url.indexOf( '/paytm-call-back' ) > 0
      ) {
        $cordovaInAppBrowser.close();
      }
    } );

    $rootScope.$on( '$cordovaInAppBrowser:exit', function ( e, event ) {
      $log.log( 'Exited inapp browser' );
      $log.log( e );
      $log.log( event );
      ctrl.checkPaymentStatus();
    } );

    ctrl.checkPaymentStatus = function () {
      $log.log( 'checkPaymentStatus' );
      $log.log( ctrl.payKey );
      Store.checkPaymentStatus( ctrl.payKey )
        .then( function ( response ) {
          $log.log( response );
          $rootScope.$emit( 'getCartTotalNumber' );
          var notification = {};
          if ( response.data.status === 'approved' ) {
            $state.go( 'store.orderhistory' );
            notification.type = 'success';
            notification.text = 'Item purchased successfully.';
            $rootScope.$emit( 'setNotification', notification );
          } else if ( response.data.status === 'retry' ) {
            $state.go( 'store.cart' );
            notification.type = 'failure';
            notification.text = 'Something went wrong. Please try again.';
          } else {
            $state.go( 'store.cart' );
            notification.type = 'failure';
            notification.text =
              'We did not recieved the payment . Please try again.';
          }
          $rootScope.$emit( 'setNotification', notification );
        } )
        .catch( function ( error ) {
          $log.log( error );
        } );
    };

    /*=====  End of Payment section  ======*/

    /*===============================================
    =            Modal related functions            =
    ===============================================*/

    $ionicModal
      .fromTemplateUrl( 'select-address-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      } )
      .then( function ( modal ) {
        ctrl.modal = modal;
      } );

    ctrl.closeModal = function () {
      ctrl.modal.hide();
    };

    $ionicModal
      .fromTemplateUrl( 'store/templates/select-payment-gateway.html', {
        scope: $scope,
        animation: 'slide-in-up'
      } )
      .then( function ( modal ) {
        ctrl.paymentGatewayModal = modal;
      } );

    ctrl.closePaymentGatewayModal = function () {
      ctrl.paymentGatewayModal.hide();
    };

    ctrl.closeModal = function () {
      ctrl.modal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on( '$destroy', function () {
      ctrl.modal.remove();
      ctrl.paymentGatewayModal.remove();
    } );

    /*=====  End of Modal related functions  ======*/
  } );
