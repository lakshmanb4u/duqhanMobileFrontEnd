'use strict';
angular
  .module('store')
  .controller('ProductCtrl', function (
    $log,
    $stateParams,
    $ionicSlideBoxDelegate,
    $state,
    $ionicActionSheet,
    $ionicModal,
    $scope,
    $rootScope,
    $ionicPopup,
    $location,
    $sce,
    $ionicSideMenuDelegate,
    Store,
    $window,
    BusyLoader
  ) {
    /* Storing contextual this in a variable for easy access */

    var ctrl = this;
    ctrl.clickonaddBag = false;

    $log.log(
      'Hello from your Controller: ProductCtrl in module store:. This is your controller:',
      ctrl
    );
    $log.log('Current location ==============================');
    $log.log($location.path());
    $log.log('Current location ==============================');

    /*=============================================
    =            Get product details            =
    =============================================*/

    /*----------  Initialize product object  ----------*/

    ctrl.product = {};
    ctrl.tabActive = 'detail';

    /*----------  Get details of a product from backend  ----------*/

    ctrl.loadProductDetail = function (productId) {
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
          $ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
          ctrl.productId = ctrl.product.productId;
          ctrl.allSelected = false;
          ctrl.allSelectedArr = [];
          if (ctrl.product.properties.length === 0) {
            ctrl.checkSelectedProperties();
          }
        })
        .catch(function (response) {
          $log.log(response);
        })
        .finally(function () {
          BusyLoader.hide();
        });
    };

    /*----------  Storing url parameter (product id) in scope ----------*/

    ctrl.productId = $stateParams.productId;

    /*----------  call the function at the time of initialization  ----------*/

    ctrl.loadProductDetail($stateParams.productId);

    /*=====  End of Get product details  ======*/

    /*==================================================
    Section: Property List
    ==================================================*/
    ctrl.trustAsHtml = function (string) {
      return $sce.trustAsHtml(string);
    };
    $ionicModal
      .fromTemplateUrl('store/templates/product/propertyListModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      })
      .then(function (modal) {
        ctrl.propertyListModal = modal;
      });
    ctrl.openPropertyList = function (p) {
      ctrl.propertyList = p;
      ctrl.propertyListModal.show();
    };
    ctrl.closePropertyListModal = function () {
      ctrl.propertyListModal.hide();
    };

    ctrl.propertySelected = function (property) {
      // $log.log(property);
      ctrl.propertyList.selectedProperty = property.value;
      ctrl.propertyList.selectedPropertyId = property.id;
      ctrl.checkSelectedProperties();
      ctrl.propertyListModal.hide();
      setTimeout(function () {
        if (ctrl.clickonaddBag) {
          ctrl.addToBagNew(ctrl.selectedProduct);
        }
      },500);
    };

    /*----------  Setting Price after selecting categories  ----------*/
    ctrl.checkSelectedProperties = function () {
      ctrl.allSelectedArr = [];
      ctrl.mapId = null;
      ctrl.discountOfferPct = 0;
      angular.forEach(ctrl.product.properties, function (i) {
        if (i.selectedPropertyId) {
          ctrl.allSelectedArr.push(i.selectedPropertyId.toString());
        }
      });
      if (ctrl.allSelectedArr.length === ctrl.product.properties.length) {
        ctrl.allSelected = true;
        ctrl.setPrice();
      }
    };

    ctrl.setPrice = function () {
      if (ctrl.allSelected) {
        if (ctrl.product.properties.length === 0) {
          // $log.log('============================ START ==============================');
          // $log.log('ADD TO CART');
          // $log.log('============================= END ===============================');
        }
        angular.forEach(ctrl.product.propertiesMapDto, function (p) {
          var pv = p.propertyvalueComposition;
          var pvArr = pv.split('_');
          var commonArr = [];
          angular.forEach(pvArr, function (a) {
            angular.forEach(ctrl.allSelectedArr, function (b) {
              if (a === b) {
                commonArr.push(a);
              }
            });
          });
          //pvArr.splice(- 1, 1);
          $log.log('============================ START ==============================');
          $log.log(ctrl.allSelectedArr.toString());
          $log.log(pvArr.toString());
          $log.log(commonArr.toString());
          $log.log('============================= END ===============================');
          if (ctrl.allSelectedArr.length === commonArr.length) {
            ctrl.product.salesPrice = p.salesPrice;
            ctrl.mapId = p.mapId;
            ctrl.discountOfferPct = 0;
          }
        });
        // if ()
      }
    };
    /*==================================================
    End: Property List
    ==================================================*/

    /*==========================================================================================
    =            Helping functions to traverse through tabs in product details page            =
    ==========================================================================================*/

    ctrl.gotoDescription = function () {
      $log.log(ctrl.productId);
      $state.go('store.product.description', { productId: ctrl.productId });
    };

    ctrl.gotoRelated = function () {
      $state.go('store.product.related', { productId: ctrl.productId });
    };

    /*=====  End of Helping functions to traverse through tabs in product details page  ======*/

    /*=================================================
    =            Add a product to the cart            =
    =================================================*/

    /*----------  Add to cart - get triggered when user press "Add to Bag" button from the product detail page ----------*/

    ctrl.addToBag = function (product) {
      ctrl.productSelected = {};
      ctrl.productSelected.productId = product.productId;
      // $log.log(product);
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
        ctrl.addToBagPersist(ctrl.productSelected, ctrl.product);
      }
    };

    /*----------  Send the product to the backend which user newly added to the cart  ----------*/

    ctrl.addToBagPersist = function (productSelected, product) {
      // delete productSelected.size;
      // $log.log(ctrl.productSelected);

      Store.addToCart(productSelected)
        .then(function (response) {
          $log.log(response.data);
          if (response.data.status === 'success') {
            productSelected.response = 'Item Added to your Bag!';
            ctrl.openModal(productSelected, product);
            $rootScope.$emit('getCartTotalNumber');
          } else if (response.data.status === 'Product already added') {
            productSelected.response = 'Item is already in the Bag!';
            ctrl.openModal(productSelected, product);
          } else {
            ctrl.showAlert = function () {
              var alertPopup = $ionicPopup.alert({
                title: 'Out of Stock',
                template: 'Oops! You just missed the last item in stock. It got sold out. Hurry up and purchase the items you like before they get sold out too.'
              });

              alertPopup.then(function () {
                $state.go('store.products.latest');
              });
            };
            ctrl.showAlert();
          }
        })
        .catch(function (response) {
          $log.log(response);
        });
    };

    ctrl.addToBagNew = function (product) {
      ctrl.clickonaddBag = true;
      ctrl.selectedProduct = product;
      if (ctrl.allSelected) {
        ctrl.clickonaddBag = false;
        var productSelected = {};
        productSelected.mapId = ctrl.mapId;
        productSelected.discountOfferPct = ctrl.discountOfferPct;
        Store.addToCart(productSelected)
          .then(function (response) {
            $log.log(response.data);
            if (response.data.status === 'success') {
              productSelected.response = 'Item Added to your Bag!';
              ctrl.openModal(productSelected, product);
              $rootScope.$emit('getCartTotalNumber');
            } else if (response.data.status === 'Product already added') {
              productSelected.response = 'Item is already in the Bag!';
              ctrl.openModal(productSelected, product);
            } else {
              ctrl.showAlert = function () {
                var alertPopup = $ionicPopup.alert({
                  title: 'Out of Stock',
                  template: 'Oops! You just missed the last item in stock. It got sold out. Hurry up and purchase the items you like before they get sold out too.'
                });

                alertPopup.then(function () {
                  $state.go('store.products.latest');
                });
              };
              ctrl.showAlert();
            }
          })
          .catch(function (response) {
            $log.log(response);
          });
        // $log.log('============================ START ==============================');
        // $log.log('ADD TO CART');
        // $log.log('============================= END ===============================');

      } else {
        var obj = false;
        for (var i = 0;i < ctrl.product.properties.length;i++) {
          obj = false;
          for (var k = 0;k < ctrl.product.properties[i].propertyValues.length;k++) {
            var ids = ctrl.product.properties[i].propertyValues[k].id;
            if (ctrl.allSelectedArr.indexOf(ids.toString()) !== -1) {
              obj = true;
              break;
            }
          }
          if (!obj) {
            ctrl.openPropertyList(ctrl.product.properties[i]);
            break;
          }
        }

        /*$ionicPopup.alert({
          title: 'Choose options',
          template: 'Please choose all the options'
        });*/
      }
    };


    /*----------  Ionic modal to show the response of addition of the product to the cart  ----------*/

    $ionicModal
      .fromTemplateUrl('store/templates/product/addedToBagModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      })
      .then(function (modal) {
        ctrl.modal = modal;
      });

    ctrl.openModal = function (productSelected, product) {
      ctrl.productSelected = productSelected;
      ctrl.product = product;
      $log.log('productSelected======');
      $log.log(ctrl.productSelected);
      ctrl.modal.show();
    };

    ctrl.closeModal = function () {
      ctrl.modal.hide();
    };

    /*----------  Open a Action sheet to select the size of the product  ----------*/

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

    /*----------  Open a Action sheet to select the color of the product  ----------*/

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
          // $log.log(ctrl.productSelected.mapId);
          ctrl.addToBagPersist(ctrl.productSelected, ctrl.product);
          return true;
        }
      });
    };
    $scope.rating = 0;
    $scope.comment = '';
    $scope.cmtTittle = '';
    $scope.reviewFlag = false;
    $scope.cmtBar = true;

    ctrl.addReviewDiv = function () {
      $scope.reviewFlag = true;
      $scope.cmtBar = false;
      document.getElementById('reviewId').style.backgroundColor = 'rgba(0,0,0,0.2)';
      setTimeout(function () {
        document.getElementById('review1').focus();
      }, 300);
    };
    ctrl.showDetail = function () {
      ctrl.tabActive = 'detail';
      $scope.cmtBar = true;
      $scope.reviewFlag = false;
    };
    $scope.onItemRating = function (rating) {
      $scope.rating = rating;
    };

    ctrl.reviewClose = function () {
      document.getElementById('reviewId').style.backgroundColor = '#f9f5f2';
      $scope.reviewFlag = false;
    },

    ctrl.addReview = function (cmtTittle, comment) {
      var review = {};
      review.comment = comment;
      review.subject = cmtTittle;
      review.rating = $scope.rating;
      review.productId = $stateParams.productId;
      Store.saveReview(review)
      .then(function (response) {
        ctrl.product.reviews = response.data.reviews;
        $scope.rating = 0;
        $scope.comment = '';
        $scope.cmtTittle = '';
        document.getElementById('reviewId').style.backgroundColor = '#f9f5f2';
        $scope.reviewFlag = false;
        $scope.cmtBar = true;
      })
      .catch(function (response) {
        $log.log(response);
      });

    };

    /*=====  End of Add a product to the cart  ======*/

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

    $ionicSideMenuDelegate.canDragContent(false);
  });
