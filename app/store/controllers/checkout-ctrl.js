'use strict';
angular
  .module('store')
  .controller('CheckoutCtrl', function (
    $rootScope,
    $scope,
    $log,
    $ionicModal,
    $stateParams,
    $cordovaInAppBrowser,
    $cordovaFacebook,
    $state,
    $ionicPopup,
    $analytics,
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
    angular.forEach(ctrl.cart.products, function (p, itr) {
      if (p.available) {
        ctrl.cart.orderTotal = ctrl.cart.orderTotal + p.discountedPrice * p.qty;
        ctrl.cart.shippingTotal = ctrl.cart.shippingTotal + p.shippingRate;
      } else {
        ctrl.cart.products.splice(itr, 1);
      }
    });
    // angular.forEach(ctrl.cart.products, function (p) {
    //   ctrl.cart.shippingTotal = ctrl.cart.shippingTotal + p.shippingRate;
    // });
    ctrl.cart.orderTotalWithShipping =
      ctrl.cart.orderTotal + ctrl.cart.shippingTotal;

    /*===========================================
    =            Get default address            =
    ===========================================*/

    ctrl.getDefaultAddress = function () {
      var s = new Date().getTime();
      Store.getDefaultAddress()
        .then(function (response) {
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Get default addresses','JS get-default-addresses',t);
          $log.log('getDefaultAddress');
          $log.log(response.data.addresses);
          if (response.data.addresses.length > 0) {
            ctrl.address = response.data.addresses[0];
            /* calling the shipping detail function to get the shipping cost with this delivery address */
            ctrl.cart.deliveryAddressId = response.data.addresses[0].addressId;
            ctrl.getShippingDetails(ctrl.cart);
          } else {
            ctrl.address = null;
          }
          return Store.getUserEmailAndPhone();
        })
        .then(function (response) {
          $log.log('getUserEmail');
          $log.log(response.data);
          ctrl.userEmail = response.data.email;
          ctrl.mobile = response.data.mobile;
        })
        .catch(function (error) {
          $log.log(error);
        });
    };

    /*=====  End of Get default address  ======*/

    /*======================================================
    =            Get the shipping cost and time            =
    ======================================================*/

    ctrl.getShippingDetails = function (cart) {
      $log.log(cart);
      var s = new Date().getTime();
      Store.getShippingDetails(cart)
        .then(function (response) {
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Get shipment','JS get-shipment',t);
          $log.log('getShippingDetails');
          $log.log(response.data);
          var tempCart = response.data;
          var orderTotal = ctrl.cart.orderTotal;
          var shippingTotal = 0;
          angular.forEach(tempCart.products, function (p, i) {
            orderTotal = orderTotal + p.shippingRate;
            shippingTotal = shippingTotal + p.shippingRate;
            ctrl.cart.products[i].shippingRate = p.shippingRate;
            ctrl.cart.products[i].shippingTime = p.shippingTime;
          });
          ctrl.cart.orderTotalWithShipping = orderTotal;
          ctrl.cart.shippingTotal = shippingTotal;
        })
        .catch(function (error) {
          $log.log(error);
        });
    };

    /*=====  End of Get the shipping cost and time  ======*/

    /*----------  call the function at the time of initialization  ----------*/

    ctrl.getDefaultAddress();

    /*----------  call the function when user is in cart page  ----------*/

    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
      $log.log(event);
      if (toState.name === 'store.checkout') {
        ctrl.getDefaultAddress();
      }
    });

    /*===============================================
    =            Change delivery address            =
    ===============================================*/

    ctrl.addressSelectionError = true;

    ctrl.changeAddress = function () {
      var s = new Date().getTime();
      Store.getAddresses()
        .then(function (response) {
          ctrl.addresses = response.data.addresses;
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Get addresses','JS get-addresses',t);
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
        /* calling the shipping detail function to get the shipping cost with this delivery address */
        ctrl.cart.deliveryAddressId = ctrl.address.addressId;
        ctrl.getShippingDetails(ctrl.cart);
        ctrl.closeModal();
      } else {
        ctrl.addressSelectionError = false;
      }
    };

    ctrl.setSelectedAddess= function(address) {
      ctrl.selectedAddress = address;
    };

    ctrl.addAddress = function () {
      ctrl.closeModal();
      $rootScope.$emit('addAddress', true);
      // $state.go('store.myaddress');
    };

    ctrl.setTempAddressForCheckout = function (address) {
      ctrl.address = address;
      /* calling the shipping detail function to get the shipping cost with this delivery address */
      ctrl.cart.deliveryAddressId = ctrl.address.addressId;
      ctrl.getShippingDetails(ctrl.cart);
    };

    // Catching calls from outside this controller
    $rootScope.$on('setTempAddressForCheckout', function (event, address) {
      $log.log(event);
      $log.log('on setTempAddressForCheckout');
      ctrl.setTempAddressForCheckout(address);
    });

    /*=====  End of Change delivery address  ======*/

    /*=======================================
    =            Set Email Address            =
    =======================================*/

    ctrl.setUserEmailAndPhone = function (email, phone) {
      ctrl.data = {};
      ctrl.data.email = email;
      ctrl.data.mobile = phone;
      $log.log(ctrl.data);
      var template = [];
      if (!email) {
        template.push('<input type="email" ng-model="ctrl.data.email" placeholder="Email Id" style="padding: 2px 5px; margin-bottom: 10px;">');
      }
      if (!phone) {
        template.push('<input type="text" ng-model="ctrl.data.mobile" placeholder="Phone Number" style="padding: 2px 5px;">');
      }
      var str = template.join('');
      $ionicPopup.show({
        template: str,
        title: 'Contact',
        subTitle: 'Please enter contact details to continue',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: 'Save',
            type: 'button-positive',
            onTap: function (e) {
              if (!ctrl.data.email || !ctrl.data.mobile) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                $log.log(ctrl.data);
                Store.setUserEmailAndPhone(ctrl.data)
                  .then(function (response) {
                    $log.log('setUserEmail');
                    if (response && response.data && response.data.email && response.data.mobile) {
                      ctrl.userEmail = response.data.email;
                      ctrl.mobile = response.data.mobile;
                      ctrl.pay();
                    } else {
                      var notification = {};
                      notification.type = 'failure';
                      notification.text = 'Something went wrong! Please try again.';
                      $rootScope.$emit('setNotification', notification);
                    }
                  })
                  .catch(function (error) {
                    $log.log(error);
                  });
              }
            }
          }
        ]
      });
    };

    /*=====  End of Set Email Address  ======*/

    /*=======================================
    =            Payment section            =
    =======================================*/

    ctrl.selectPaymentGateway = function () {
      ctrl.cart.paymentGateway = 2;
      ctrl.paymentGatewayModal.show();
    };

    ctrl.pay = function () {
      ctrl.cordovaInAppBrowserRef = null;
      $log.log(ctrl.cart);
      $log.log(ctrl.address);
      ctrl.closePaymentGatewayModal();
      if (!ctrl.address) {
        var notification = {};
        notification.type = 'failure';
        notification.text = 'Please select a delivery address';
        $rootScope.$emit('setNotification', notification);
        return;
      }
      if (!ctrl.userEmail || !ctrl.mobile) {
        $log.log('email not found');
        ctrl.setUserEmailAndPhone(ctrl.userEmail, ctrl.mobile);
        return;
      }
      ctrl.cart.deliveryAddressId = ctrl.address.addressId;
      ctrl.cart.addressDto = ctrl.address;

      var s = new Date().getTime();
      Store.checkout(ctrl.cart)
        .then(function (response) {
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Checkout','JS checkout',t);
          $log.log('response ==');
          $log.log(response.data.status);
          ctrl.paymentUrl = response.data.paymentUrl;
          ctrl.payKey = response.data.statusCode;
          var browserOptions = 'EnableViewPortScale=yes,transitionstyle=fliphorizontal,toolbarposition=top,closebuttoncaption=BACK,location=no';
          /* eslint-disable no-undef */
          ctrl.cordovaInAppBrowserRef = cordova.InAppBrowser.open(ctrl.paymentUrl, '_blank,', browserOptions);
          // ctrl.cordovaInAppBrowserRef = new $cordovaInAppBrowser(response.data.paymentUrl, '_blank,', browserOptions);
          if (ctrl.cart.paymentGateway === 2) {
            ctrl.script = '';
            var options = response.data.parameters;
            for (var key in options) {
              if (options.hasOwnProperty(key)) {
                $log.log(key + ' -> ' + options[key]);
                ctrl.script +=
                  'document.getElementById("' +
                  key +
                  '").value="' +
                  options[key] +
                  '";';
              }
            }
            ctrl.script += 'document.getElementById("paytmForm").submit();';
          }
          $log.log(ctrl.cordovaInAppBrowserRef);
          ctrl.cordovaInAppBrowserRef.addEventListener('loadstop', ctrl.cordovaInAppBrowserStop);
          ctrl.cordovaInAppBrowserRef.addEventListener('exit', ctrl.cordovaInAppBrowserExit);
        })
        .catch(function (error) {
          $log.log(error);
        });
    };

    ctrl.cordovaInAppBrowserStop = function (event) {
      if (ctrl.cart.paymentGateway === 2) {
        $log.log('loadstop');
        $log.log(ctrl.script);
        $log.log('Current url=============================');
        $log.log(event.url);
        if (event.url.indexOf(ctrl.paymentUrl) === 0) {
          // insert Javascript via code / file
          ctrl.cordovaInAppBrowserRef.executeScript({
            code: ctrl.script
          });
        }
      }
      if (
        event.url.indexOf('/to-be-redirected') > 0 ||
        event.url.indexOf('/to-be-canceled') > 0 ||
        event.url.indexOf('/paytm-call-back') > 0
      ) {
        ctrl.cordovaInAppBrowserRef.close();
      }
    };
    ctrl.cordovaInAppBrowserExit = function (event) {
      $log.log('Exited inapp browser');
      $log.log(event);
      ctrl.checkPaymentStatus();
    };

    ctrl.checkPaymentStatus = function () {
      $log.log('checkPaymentStatus');
      $log.log(ctrl.payKey);
      var s = new Date().getTime();
      Store.checkPaymentStatus(ctrl.payKey)
        .then(function (response) {
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Check payment status','JS check-payment-status',t);
          $log.log(response);
          $rootScope.$emit('getCartTotalNumber');
          var notification = {};
          if (response.data.status === 'approved') {
            $state.go('store.orderhistory');
            notification.type = 'success';
            notification.text = 'Item purchased successfully.';
            $cordovaFacebook.logPurchase(ctrl.cart.orderTotalWithShipping, 'INR');
            $analytics.eventTrack('Purchase', { currency: 'INR', value: ctrl.cart.orderTotalWithShipping });
            $rootScope.$emit('setNotification', notification);
          } else if (response.data.status === 'retry') {
            $state.go('store.cart');
            notification.type = 'failure';
            notification.text = 'Something went wrong. Please try again.';
          } else {
            $state.go('store.cart');
            notification.type = 'failure';
            notification.text =
              'We did not recieved the payment . Please try again.';
          }
          $rootScope.$emit('setNotification', notification);
        })
        .catch(function (error) {
          $log.log(error);
        });
    };

    /*=====  End of Payment section  ======*/

    /*===============================================
    =            Modal related functions            =
    ===============================================*/

    $ionicModal
      .fromTemplateUrl('select-address-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      })
      .then(function (modal) {
        ctrl.modal = modal;
      });

    ctrl.closeModal = function () {
      ctrl.modal.hide();
    };

    $ionicModal
      .fromTemplateUrl('store/templates/select-payment-gateway.html', {
        scope: $scope,
        animation: 'slide-in-up'
      })
      .then(function (modal) {
        ctrl.paymentGatewayModal = modal;
      });

    ctrl.closePaymentGatewayModal = function () {
      ctrl.paymentGatewayModal.hide();
    };

    ctrl.closeModal = function () {
      ctrl.modal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      ctrl.modal.remove();
      ctrl.paymentGatewayModal.remove();
    });

    /*=====  End of Modal related functions  ======*/
  });
