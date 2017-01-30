'use strict';
angular.module('store')
.controller('ProductsByCategoryCtrl', function ($log, $stateParams, $state, Product) {

  $log.log('Hello from your Controller: ProductsByCategoryCtrl in module store:. This is your controller:', this);

  /* Storing contextual this in a variable for easy access */

  var ctrl = this;

  /*----------  Storing url parameter (product id) in scope ----------*/

  ctrl.categoryId = $stateParams.categoryId;

  /*=================================================
  =            Show products by category            =
  =================================================*/

  /*----------  Get products by category  ----------*/

  ctrl.loadProductListByCategory = function () {
    var productsParam = {categoryId: ctrl.categoryId};
    Product.getProductList(productsParam)
    .then(function (data) {
      ctrl.products = data.products;
      ctrl.productCategory = data.categoryName;
    })
    .catch(function (response) {
      $log.log(response);
    });
  };

  /*----------  call the function at the time of initialization  ----------*/

  if ($state.current.name === 'store.productsByCategory') {
    ctrl.loadProductListByCategory();
  }

  /*=====  End of Show products by category  ======*/


  /*===============================================
  =            Show category list page            =
  ===============================================*/

  ctrl.loadChildCategories = function () {
    Product.getChildCategories(ctrl.categoryId)
    .then(function (categories) {
      ctrl.categories = categories;
    })
    .catch(function (response) {
      $log.log(response);
    });
  };

  /*----------  call the function at the time of initialization  ----------*/

  if ($state.current.name === 'store.categories') {
    ctrl.loadChildCategories();
  }

  /*=====  End of Show category list page  ======*/
});
