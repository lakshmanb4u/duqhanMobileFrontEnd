'use strict';
angular.module('store')
  .controller('FreeProductCtrl', function ($log, $ionicSlideBoxDelegate, $stateParams, $ionicActionSheet, $ionicModal, $rootScope, $ionicPopup, $scope, $state, $cordovaFacebook, $analytics, BusyLoader, Store) {

    $log.log('Hello from your Controller: FreeProductCtrl in module store:. This is your controller:', this);

    /* Storing contextual this in a variable for easy access */
    var ctrl = this;

    /*==================================================
      Section: Free product details
      ==================================================*/

    /*----------  Initialize product object  ----------*/
    ctrl.product = {};

    /*----------  Get details of a product from backend  ----------*/
    ctrl.loadFreeProductDetail = function (productId) {
      var productParam = { productId: productId };
      BusyLoader.show();
      Store.getProductDetail(productParam)
        .then(function (response) {
          $log.log(response.data);
          ctrl.product = response.data;
          $log.log(ctrl.images);
          $log.log(ctrl.product.images);
          var sizeArr = [];
          if (ctrl.product.sizes) {
            angular.forEach(ctrl.product.sizes, function (value) {
              sizeArr.push(value.sizeText);
            });
          }
          ctrl.product.sizeArr = sizeArr.toString();
          var colorArr = [];
          if (ctrl.product.sizes) {
            angular.forEach(ctrl.product.colors, function (value) {
              colorArr.push(value.colorText);
            });
          }
          ctrl.product.colorArr = colorArr.toString();
          ctrl.productId = ctrl.product.productId;
          $ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
        })
        .catch(function (response) {
          $log.log(response);
        })
        .finally(function () {
          BusyLoader.hide();
        });
    };

    /*==================================================
    End: Free product details
    ==================================================*/

    /*==================================================
    Section: Prepare the cart
    ==================================================*/

    /*----------  Color Modal Initialization  ----------*/
    ctrl.colorModal = function () {
      var buttons = [];
      angular.forEach(ctrl.productSelected.size.sizeColorMap, function (value) {
        buttons.push({ text: value.colorText });
      });

      $ionicActionSheet.show({
        buttons: buttons,
        titleText: 'Select color',
        cancelText: 'Cancel',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          // $log.log(index);
          // $log.log(ctrl.productSelected.size.sizeColorMap[index]);
          ctrl.productSelected.size.sizeColor =
            ctrl.productSelected.size.sizeColorMap[index];
          ctrl.productSelected.mapId =
            ctrl.productSelected.size.sizeColor.mapId;
          ctrl.cart.userId = ctrl.productSelected.mapId;
          // $log.log(ctrl.productSelected.mapId);
          ctrl.collectContactDetails();
          return true;
        }
      });
    };

    /*----------  Size Modal Initialization  ----------*/
    ctrl.sizeModal = function () {
      var buttons = [];
      angular.forEach(ctrl.product.sizes, function (value) {
        buttons.push({ text: value.sizeText });
      });
      $ionicActionSheet.show({
        buttons: buttons,
        titleText: 'Select size',
        cancelText: 'Cancel',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          // $log.log(index);
          // $log.log(ctrl.product.sizes[index]);
          ctrl.productSelected.size = ctrl.product.sizes[index];
          if (ctrl.productSelected.size.sizeColorMap) {
            ctrl.colorModal();
          }
          return true;
        }
      });
    };

    ctrl.prepareCart = function (product) {
      ctrl.cart = {};
      ctrl.productSelected = {};
      ctrl.productSelected.productId = product.productId;
      $log.log(product);
      if (!product.sizes || !product.sizes.length > 0) {
        return;
      }
      if (product.sizes[0].sizeId) {
        ctrl.sizeModal();
      } else if (product.sizes[0].sizeColorMap[0].colorId) {
        ctrl.productSelected.size = ctrl.product.sizes[0];
        ctrl.colorModal();
      } else {
        ctrl.productSelected.mapId =
          ctrl.product.sizes[0].sizeColorMap[0].mapId;
        ctrl.cart.userId = ctrl.productSelected.mapId;
        ctrl.collectContactDetails();
      }
    };

    /*==================================================
    End: Prepare the cart
    ==================================================*/

    /*==================================================
    Section: Delivery address selection
    ==================================================*/

    ctrl.addressSelectionError = true;

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
                      ctrl.purchaseFreeProduct();
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

    ctrl.collectContactDetails = function () {
      Store.getUserEmailAndPhone()
        .then(function (response) {
          $log.log('getUserEmail');
          $log.log(response.data);
          ctrl.userEmail = response.data.email;
          ctrl.mobile = response.data.mobile;
          return Store.getAddresses();
        })
        .then(function (response) {
          ctrl.addresses = response.data.addresses;
          ctrl.modal.show();
        })
        .catch(function (error) {
          $log.log(error);
        });
    };

    ctrl.selectAddress = function () {
      if (ctrl.selectedAddress) {
        ctrl.address = ctrl.selectedAddress;
        ctrl.cart.deliveryAddressId = ctrl.address.addressId;
        ctrl.closeModal();
        if (!ctrl.userEmail || !ctrl.mobile) {
          $log.log('email not found');
          ctrl.setUserEmailAndPhone(ctrl.userEmail, ctrl.mobile);
        } else {
          ctrl.purchaseFreeProduct();
        }
      } else {
        ctrl.addressSelectionError = false;
      }
    };

    ctrl.addAddress = function () {
      ctrl.closeModal();
      $rootScope.$emit('addAddress', true);
      // $state.go('store.myaddress');
    };

    /*==================================================
    End: Delivery address selection
    ==================================================*/

    /*==================================================
    Section: Purch free product
    ==================================================*/

    ctrl.purchaseFreeProduct = function () {
      $log.log(ctrl.cart);
      Store.purchaseFreeProduct(ctrl.cart)
        .then(function (response) {
          $log.log(response);
          if (response.data.statusCode === '200') {
            $state.go('store.orderhistory');
            var notification = {};
            notification.type = 'success';
            notification.text = 'Item purchased successfully.';
            $cordovaFacebook.logPurchase(0, 'INR');
            $analytics.eventTrack('Purchase', { currency: 'INR', value: 0 });
            $rootScope.$emit('setNotification', notification);
          } else if (response.data.statusCode === '208') {
            $state.go('store.products.latest');
            // eslint-disable-next-line no-redeclare
            var notification = {};
            notification.type = 'failure';
            notification.text = 'Already claimed a free product.';
            $rootScope.$emit('setNotification', notification);
          }
        })
        .catch(function (error) {
          $log.log(error);
        });
    };

    /*==================================================
    End: Purch free product
    ==================================================*/

    /*==================================================
    Section: Initialization
    ==================================================*/

    ctrl.productId = $stateParams.productId;
    ctrl.loadFreeProductDetail(ctrl.productId);

    /*==================================================
    End: Initialization
    ==================================================*/

  });
