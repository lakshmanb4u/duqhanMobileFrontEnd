'use strict';
angular.module('store')
.controller('ProductCtrl', function ($log, $stateParams, $ionicSlideBoxDelegate, $state, $ionicActionSheet, $ionicModal, $scope, Store) {

  var ctrl = this;

  $log.log('Hello from your Controller: ProductCtrl in module store:. This is your controller:', ctrl);

  ctrl.product = {};
  ctrl.relatedProducts = [1, 2, 3, 4, 5, 6];
  ctrl.images = [
    {imgUrl: 'http://res.cloudinary.com/duqhan/image/upload/v1484226413/test/T%20Shirts.jpg'},
    {imgUrl: 'http://res.cloudinary.com/duqhan/image/upload/v1484226402/test/Trousers.jpg'},
    {imgUrl: 'http://res.cloudinary.com/duqhan/image/upload/v1484226463/test/tv.jpg'}
  ];

  ctrl.loadProductDetail = function (productId) {
    var productParam = {'productId': productId};
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
      $ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
      ctrl.productId = ctrl.product.productId;
    })
    .catch(function (response) {
      $log.log(response);
    });
  };

  ctrl.productId = $stateParams.productId;
  ctrl.loadProductDetail($stateParams.productId);

  ctrl.gotoDescription = function () {
    $log.log(ctrl.productId);
    $state.go('store.product.description', {productId: ctrl.productId});
  };

  ctrl.gotoRelated = function () {
    $state.go('store.product.related', {productId: ctrl.productId});
  };

  ctrl.addToBag = function (product) {
    ctrl.productSelected = {};
    ctrl.productSelected.productId = product.productId;
    $log.log(product);
    if (product.sizes) {
      var buttons = [];
      angular.forEach(ctrl.product.sizes, function (value) {
        buttons.push({text: value.sizeText});
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
          ctrl.productSelected.size1 = ctrl.product.sizes[index];
          if (ctrl.productSelected.size1.sizeColorMap) {
            var buttons = [];
            angular.forEach(ctrl.productSelected.size1.sizeColorMap, function (value) {
              buttons.push({text: value.colorText});
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
                ctrl.productSelected.size1.sizeColorMap1 = ctrl.productSelected.size1.sizeColorMap[index];
                ctrl.productSelected.mapId = ctrl.productSelected.size1.sizeColorMap1.mapId;
                // $log.log(ctrl.productSelected.mapId);
                ctrl.addToBagPersist(ctrl.productSelected, ctrl.product);
                return true;
              }
            });
          }
          return true;
        }
      });
    }
  };

  ctrl.addToBagPersist = function (productSelected, product) {
    // delete productSelected.size;
    $log.log(ctrl.productSelected);
    ctrl.openModal(productSelected, product);

    // Store.addToCart(productSelected)
    // .then(function (response) {
    //   $log.log(response.data);

    // })
    // .catch(function (response) {
    //   $log.log(response);
    // });
  };

  $ionicModal.fromTemplateUrl('store/templates/product/addedToBagModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    ctrl.modal = modal;
  });

  ctrl.openModal = function (productSelected, product) {
    ctrl.productSelected = productSelected;
    ctrl.product = product;
    $log.log(ctrl.product);
    $log.log(ctrl.productSelected);
    ctrl.modal.show();
  };

  ctrl.closeModal = function () {
    ctrl.modal.hide();
  };

});
