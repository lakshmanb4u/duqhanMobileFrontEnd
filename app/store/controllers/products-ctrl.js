'use strict';
angular.module('store')
.controller('ProductsCtrl', function (
  $log,
  $rootScope,
  $timeout,
  $ImageCacheFactory,
  $state,
  $scope,
  $ionicScrollDelegate,
  BusyLoader,
  Store,
  Config,
  $ionicHistory,
  $localStorage,
  $http
) {

  /* Storing contextual this in a variable for easy access */

  var ctrl = this;

  
  $log.log('Hello from your Controller: ProductsCtrl in module store:. This is your controller:', ctrl);

  /*========================================
  =            Get product list            =
  ========================================*/

  /*----------  Initialize products object  ----------*/
  //$cordovaGoogleAnalytics.startTrackerWithId('UA-120903553-1');
  //$cordovaGoogleAnalytics.trackView('Home Screen');
 /* setTimeout(function(){

      window.ga.startTrackerWithId('UA-120903553-1',30,
                   function(success){
                     alert(JSON.stringify(success));
                   },
                   function(error){
                     alert(JSON.stringify(error));
                  }); 

 }, 3000); */
    setTimeout(function(){
      window.ga.trackView('Home Screen');
    },4000);
    
  ctrl.products = [];
  ctrl.start = 0;
  ctrl.page = 0;
  ctrl.noMoreItemsAvailable = false;
  ctrl.spiner = false;
  ctrl.likeUnlikeFlag = false;
  /*----------  Get list of products from backend  ----------*/

  
  ctrl.next = function () {
    var mySwiper = document.querySelector('.swiper-container').swiper;
    mySwiper.slideNext();
  };

  ctrl.prev = function () {
      var mySwiper = document.querySelector('.swiper-container').swiper;
      mySwiper.slidePrev();
    };

  ctrl.loadProductList = function (productsParam) {
    if (ctrl.products.length === 0) {
      BusyLoader.show();
    } else {
      ctrl.spiner = true;
    }
    var products = [];
    var s = new Date().getTime();
    Store.getProducts(productsParam)
    .then(function (response) {
      var e = new Date().getTime();
      var t = e-s;
      console.log("total time taken",t);
      Store.awsCloudWatch('JS Mob Get product','JS Mob get-product',t);
      $log.log(response);
      products = response.data.products;
      ctrl.productCategory = response.data.categoryName;
      // return $ImageCacheFactory.Cache(response.data.allImages);
      return;
    })
    .then(function () {
      /* Randoize items */
      // if (!productsParam.isRecent) {
      //   products.sort(function () {
      //     return .5 - Math.random();
      //   });
      // }
      ctrl.products = ctrl.products.concat(products);
      ctrl.page++;
      if (products.length > 0) {
        ctrl.noMoreItemsAvailable = false;
      }
      BusyLoader.hide();
      ctrl.spiner = false;
    })
    .catch(function (response) {
      $log.log(response);
      BusyLoader.hide();
      ctrl.spiner = false;
    });
  };

  /*----------  Get latest products  ----------*/

  ctrl.loadLatestProductList = function () {
    var productsParam = {
      start: ctrl.start + (ctrl.page * Config.ENV.PRODUCTS_PER_PAGE),
      limit: Config.ENV.PRODUCTS_PER_PAGE,
      isRecent: false,
      categoryId: null
    };
    ctrl.loadProductList(productsParam);
  };

  /*----------  Get recently viewd products  ----------*/

  ctrl.loadRecentlyViewedProductList = function () {
    var productsParam = {
      start: ctrl.start + (ctrl.page * Config.ENV.PRODUCTS_PER_PAGE),
      limit: Config.ENV.PRODUCTS_PER_PAGE,
      isRecent: true,
      categoryId: null
    };
    ctrl.loadProductList(productsParam);
  };

  /*----------  Load more products  ----------*/
  ctrl.loadMore = function () {
    if (!ctrl.noMoreItemsAvailable) {
      ctrl.noMoreItemsAvailable = true;
      $scope.$broadcast('scroll.infiniteScrollComplete');
      if ($state.current.name === 'store.products.recent') {
        ctrl.loadRecentlyViewedProductList();
      } else if ($state.current.name === 'store.products.latest') {
        ctrl.loadLatestProductList();
      }
    }
  };

  /*----------  call the function at the time of initialization  ----------*/
  if($localStorage.countryCode){
    ctrl.loadLatestProductList();
  }else{
    $http.get('https://api.ipdata.co')
    .success(function(data) {
    $localStorage.countryCode = data.country_code;
    ctrl.loadLatestProductList();
  })
    .error(function(data){
        $localStorage.countryCode = "IN";
    });
  }

  /*----------  Get the latest or recent products depending on which page user is in  ----------*/

  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    $ionicScrollDelegate.scrollTop();
    ctrl.products = [];
    ctrl.start = 0;
    ctrl.page = 0;
    ctrl.noMoreItemsAvailable = false;
    $log.log('toState:', toState);
    if (toState.name === 'store.products.recent') {
      $log.log('Load recent list');
      ctrl.loadRecentlyViewedProductList();
    } else if (toState.name === 'store.products.latest') {
      $log.log('Load latest list');
      ctrl.loadLatestProductList();
    }
  });
 /* ctrl.likeUnlick = function (productId) {
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

  /*=====  End of Get product list  ======*/

});
var currency_symbols = {
  'USD': '$', // US Dollar
  'EUR': '€', // Euro
  'GBP': '£', // British Pound Sterling
  'ILS': '₪', // Israeli New Sheqel
  'INR': '₹', // Indian Rupee
  'JPY': '¥', // Japanese Yen
  'KRW': '₩', // South Korean Won
  'NGN': '₦', // Nigerian Naira
  'PHP': '₱', // Philippine Peso
  'PLN': 'zł', // Polish Zloty
  'PYG': '₲', // Paraguayan Guarani
  'THB': '฿', // Thai Baht
  'UAH': '₴', // Ukrainian Hryvnia
  'VND': '₫', // Vietnamese Dong
  'KWD': 'د.ك',
};
angular
  .module('store').filter('currencySymbol', function ($filter) {
    return function (amount, currency) {
      return $filter('currency')(amount, currency_symbols[currency]);
    };
  });

