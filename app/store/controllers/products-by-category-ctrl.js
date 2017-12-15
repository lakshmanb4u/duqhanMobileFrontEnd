'use strict';
angular
  .module( 'store' )
  .controller( 'ProductsByCategoryCtrl', function (
    $log,
    $stateParams,
    $state,
    $rootScope,
    $scope,
    $ionicScrollDelegate,
    $ionicSideMenuDelegate,
    $ionicSlideBoxDelegate,
    Product,
    Config,
    BusyLoader
  ) {
    $log.log(
      'Hello from your Controller: ProductsByCategoryCtrl in module store:. This is your controller:',
      this
    );

    /* Storing contextual this in a variable for easy access */

    var ctrl = this;
    $ionicSideMenuDelegate.canDragContent( false );

    /*----------  Storing url parameter (product id) in scope ----------*/

    ctrl.categoryId = $stateParams.categoryId;

    /*----------  Initialize products object  ----------*/

    ctrl.products = [];
    ctrl.start = 0;
    ctrl.page = 0;
    ctrl.noMoreItemsAvailable = false;
    ctrl.initialize = false;
    ctrl.spiner = false;
    ctrl.apicallflag = false;
    ctrl.likeUnlikeFlag = false;
    /*==================================================
    Section: Slider button to navigate throuh images
    ==================================================*/
    ctrl.swiper = {};
    $scope.next = function () {
      ctrl.swiper.slideNext();
    };
    $scope.onReadySwiper = function ( swiper ) {
      $log.log( 'onReadySwiper' );
      swiper.on( 'slideChangeStart', function () {
        $log.log( 'slideChangeStart' );
      } );
    };

    ctrl.getProduct = function () {
      $ionicScrollDelegate.scrollTop();
      ctrl.products = [];
      ctrl.start = 0;
      ctrl.page = 0;
      ctrl.noMoreItemsAvailable = false;
      if ($state.current.name === 'store.productsByCategory' ) {
        ctrl.initialize = true;
        ctrl.loadProductListByCategory();
        ctrl.loadChildCategories();
      } else if ($state.current.name === 'store.categories') {
        ctrl.loadChildCategories();
      }
    };
    /*==================================================
    End: Slider button to navigate throuh images
    ==================================================*/

    /*===============================================
    =            Show category list page            =
    ===============================================*/

    ctrl.loadChildCategories = function () {
      Product.getChildCategoriesById( ctrl.categoryId )
        .then( function ( categories ) {
          ctrl.categories = categories.categoryDtos;
          ctrl.categoryName = categories.categoryName;
          $log.log( '====================================================' );
          $log.log( ctrl.categories );
          $log.log( '====================================================' );
          ctrl.swiper.initObservers();
        } )
        .catch( function ( response ) {
          $log.log( response );
        } );
    };

    $scope.countValue = 0;

    /*----------  call the function at the time of initialization  ----------*/

    //mnt

    /*if ( $state.current.name === 'store.categories' ) {
      ctrl.loadChildCategories();
    }*/

    //end

    /*=====  End of Show category list page  ======*/

    /*=================================================
    =            Show products by category            =
    =================================================*/

    /*----------  Get products by category  ----------*/

    ctrl.loadProductListByCategory = function () {
      var productsParam = {
        start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
        limit: Config.ENV.PRODUCTS_PER_PAGE,
        isRecent: false,
        categoryId: ctrl.categoryId
      };
      if ( ctrl.products.length === 0 ) {
        BusyLoader.show();
      } else {
        ctrl.spiner = true;
      }
      ctrl.apicallflag = false;
      Product.getProductList( productsParam )
        .then( function ( data ) {
          ctrl.apicallflag = true;
          $scope.countValue = 0;
          /* Randoize items */
          /*data.products.sort( function () {
            return 0.5 - Math.random();
          } );*/
          ctrl.products = ctrl.products.concat( data.products );
          ctrl.page++;
          if ( data.products.length > 0 ) {
            ctrl.noMoreItemsAvailable = false;
          }
          BusyLoader.hide();
          ctrl.spiner = false;
        } )
        .catch( function ( response ) {
          $log.log( response );
          BusyLoader.hide();
          ctrl.spiner = false;
        } );
    };

    ctrl.loadProductListByCategory();
    ctrl.loadChildCategories();
    /*----------  Load more products  ----------*/
    ctrl.loadMore = function () {
      if ( !ctrl.noMoreItemsAvailable ) {
        ctrl.noMoreItemsAvailable = true;
        $scope.$broadcast( 'scroll.infiniteScrollComplete' );
        if ( $state.current.name === 'store.productsByCategory' ) {
          ctrl.loadProductListByCategory();
        }
      }
    };

 /*----------  call the function at the time of initialization  ----------*/

    //mnt
    /*if ( $state.current.name === 'store.productsByCategory' ) {
      if ( !ctrl.initialize ) {
        ctrl.initialize = true;
        ctrl.loadProductListByCategory();
        ctrl.loadChildCategories();
      }
    }*/
    //end

    /*----------  Get the products depending on which page user is in  ----------*/

    //mnt
    /*$rootScope.$on( '$stateChangeSuccess', function ( event, toState ) {
      $ionicScrollDelegate.scrollTop();
      ctrl.products = [];
      ctrl.start = 0;
      ctrl.page = 0;
      ctrl.noMoreItemsAvailable = false;
      if ( toState.name === 'store.productsByCategory' ) {
        ctrl.initialize = true;
        ctrl.loadProductListByCategory();
        ctrl.loadChildCategories();
      }
    });*/

    //end

    /*ctrl.likeUnlick = function (productId) {
      $log.log(productId);
      ctrl.likeUnlikeFlag = ctrl.likeUnlikeFlag ? false : true;
      BusyLoader.show();
      var likeunlikeObj = {
        productId: $stateParams.productId,
        likeUnlike: ctrl.likeUnlikeFlag
      };
      Store.likeUnlikeProduct(likeunlikeObj)
      .then(function (response) {
        $log.log(response);
        if (ctrl.likeUnlikeFlag) {
          ctrl.product.likeUnlikeCount++;
        } else {
          ctrl.product.likeUnlikeCount--;
        }
        BusyLoader.hide();
      })
      .catch(function (response) {
        $log.log(response);
        BusyLoader.hide();
      });
    };*/

    /*=====  End of Show products by category  ======*/

  } );
