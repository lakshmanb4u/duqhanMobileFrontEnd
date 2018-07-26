'use strict';
angular
  .module('store', [
    'ionic',
    'ionicImgCache',
    'ngCordova',
    'ui.router',
    'ionic-datepicker',
    'ionic.ion.imageCacheFactory',
    'angularMoment',
    'ionic.closePopup',
    'ksSwiper',
    'ionic.native'

    // TODO: load other modules selected during generation
  ])

  .run(function ($ionicPlatform, $cordovaDeeplinks, $state, $timeout, $log, Config) {
    $ionicPlatform.ready(function () {
      if (window.cordova) {
        $cordovaDeeplinks.route({
          '#/store/product/:productId': {
            target: 'store.product',
            parent: 'store.products.latest'
          }
        }).subscribe(function (match) {
          $log.log('Match', match);
          Config.ENV.DEEP_LINK = match.$link.fragment;
        }, function (nomatch) {
          $log.log('No match', nomatch);
          Config.ENV.DEEP_LINK = nomatch.$link.fragment;
        });
      }
    });
  })


  .config(function ($stateProvider, $ionicConfigProvider) {
    // $ionicConfigProvider.tabs.style('striped');
    $ionicConfigProvider.tabs.position('top');
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.previousTitleText(false);

    // ROUTING with ui.router
    $stateProvider
      // this state is placed in the <ion-nav-view> in the index.html
      .state('store', {
        url: '/store',
        abstract: true,
        templateUrl: 'store/templates/menu.html',
        controller: 'StoreMenuCtrl as menu'
      })
      .state('store.products', {
        url: '/products',
        abstract: true,
        views: {
          storeContent: {
            templateUrl: 'store/templates/products/products-container.html',
            controller: 'ProductsCtrl as ctrl'
          }
        }
      })
      .state('store.products.latest', {
        url: '/latest',
        cache: false,
        views: {
          productsContent: {
            templateUrl: 'store/templates/products/products.html'
          }
        }
      })
      .state('store.products.recent', {
        url: '/recent',
        cache: false,
        views: {
          productsContent: {
            templateUrl: 'store/templates/products/products.html'
          }
        }
      })
      .state('store.productsSearch', {
        url: '/products-search/:searchText',
        // cache: false,
        views: {
          storeContent: {
            templateUrl: 'store/templates/products/products-search.html',
            controller: 'SearchCtrl as ctrl'
          }
        }
      })
      .state('store.productsByCategory', {
        url: '/products-by-category/:categoryId',
        cache: false,
        views: {
          storeContent: {
            templateUrl: 'store/templates/products/products-by-category.html',
            controller: 'ProductsByCategoryCtrl as ctrl'
          }
        }
      })
      .state('store.categories', {
        url: '/categories/:categoryId',
        // cache: false,
        views: {
          storeContent: {
            templateUrl: 'store/templates/products/categories.html',
            controller: 'ProductsByCategoryCtrl as ctrl'
          }
        }
      })
      .state('store.freeProducts', {
        url: '/free-products',
        views: {
          storeContent: {
            templateUrl: 'store/templates/products/free-products.html',
            controller: 'FreeProductsCtrl as ctrl'
          }
        }
      })
      .state('store.freeProduct', {
        url: '/free-products/:productId',
        views: {
          storeContent: {
            templateUrl: 'store/templates/product/free-product.html',
            controller: 'FreeProductCtrl as ctrl'
          }
        }
      })
      .state('store.product', {
        url: '/product/:productId',
        abstract: true,
        cache: false,
        views: {
          storeContent: {
            templateUrl: 'store/templates/product/product-tab.html',
            controller: 'ProductCtrl as ctrl'
          }
        }
      })
      .state('store.product.overview', {
        url: '/overview',
        views: {
          overviewProductContent: {
            templateUrl: 'store/templates/product/overview.html'

            // controller: 'ProductCtrl as ctrl'
          }
        }
      })
      .state('store.product.related', {
        url: '/related',
        views: {
          relatedProductContent: {
            templateUrl: 'store/templates/product/related.html'

            // controller: 'ProductCtrl as ctrl'
          }
        }
      })
      .state('store.product.description', {
        url: '/description',
        views: {
          descriptionProductContent: {
            templateUrl: 'store/templates/product/description.html'

            // controller: 'ProductCtrl as ctrl'
          }
        }
      })
      .state('store.cart', {
        url: '/cart',
        views: {
          storeContent: {
            templateUrl: 'store/templates/cart.html',
            controller: 'CartCtrl as ctrl'
          }
        }
      })
      .state('store.checkout', {
        url: '/checkout',
        params: {
          cart: null
        },
        views: {
          storeContent: {
            templateUrl: 'store/templates/checkout.html',
            controller: 'CheckoutCtrl as ctrl'
          }
        }
      })
      .state('store.profile', {
        url: '/profile',
        views: {
          storeContent: {
            templateUrl: 'store/templates/profile.html',
            controller: 'ProfileCtrl as ctrl'
          }
        }
      })
      .state('store.changepassword', {
        url: '/change-password',
        views: {
          storeContent: {
            templateUrl: 'store/templates/change-password.html'

            // controller: '<someCtrl> as ctrl'
          }
        }
      })
      .state('store.myaddress', {
        url: '/my-address',
        views: {
          storeContent: {
            templateUrl: 'store/templates/my-address.html',
            controller: 'AddressCtrl as ctrl'
          }
        }
      })
      .state('store.orderhistory', {
        url: '/order-history',
        views: {
          storeContent: {
            templateUrl: 'store/templates/order-history.html',
            controller: 'OrderHistoryCtrl as ctrl'
          }
        }
      })
      .state('store.orderdetails', {
        url: '/order-details',
        params: {
          order: null
        },
        views: {
          storeContent: {
            templateUrl: 'store/templates/order-details.html',
            controller: 'OrderHistoryCtrl as ctrl'
          }
        }
      })
      .state('store.returnOrder', {
        url: '/return-order/:orderId',
        views: {
          storeContent: {
            templateUrl: 'store/templates/order-return.html',
            controller: 'OrderHistoryCtrl as ctrl'
          }
        }
      })
      .state('store.customersupport', {
        url: '/customer-support/:p',
        views: {
          storeContent: {
            templateUrl: 'store/templates/customer-support.html',
            controller: 'CustomerSupportCtrl as ctrl'
          }
        }
      })
      .state('store.sizes', {
        url: '/sizes',
        views: {
          storeContent: {
            templateUrl: 'store/templates/size-chart.html',
            controller: 'SizeChartCtrl as ctrl'
          }
        }
      })
      .state('store.shipping', {
        url: '/shipping',
        views: {
          storeContent: {
            templateUrl: 'store/templates/shipping.html',
            controller: 'ShippingCtrl as ctrl'
          }
        }
      })
      .state('store.returnpolicy', {
        url: '/return-policy',
        views: {
          storeContent: {
            templateUrl: 'store/templates/return-policy.html',
            controller: 'ReturnPolicyCtrl as ctrl'
          }
        }
      })
      .state('store.aboutus', {
        url: '/aboutus',
        views: {
          storeContent: {
            templateUrl: 'store/templates/misc/about.html',
            controller: 'AboutCtrl as ctrl'
          }
        }
      })
      .state('store.contactus', {
        url: '/contactus',
        views: {
          storeContent: {
            templateUrl: 'store/templates/contactus.html',
            controller: 'ContactusCtrl as ctrl'
          }
        }
      })
      .state('store.privacyPolicy', {
        url: '/privacy-policy',
        views: {
          storeContent: {
            templateUrl: 'store/templates/misc/privacy-policy.html',
            controller: 'PrivacyPolicyCtrl as ctrl'
          }
        }
      })
      .state('store.termsConditions', {
        url: '/terms-conditions',
        views: {
          storeContent: {
            templateUrl: 'store/templates/misc/terms-conditions.html',
            controller: 'TermsConditionsCtrl as ctrl'
          }
        }
      })
      .state('store.guestLanding', {
        url: '/guest-landing/:productId',
        views: {
          storeContent: {
            templateUrl: 'store/templates/guest-landing.html',
            controller: 'GuestUserCtrl as ctrl'
          }
        }
      })
      .state('store.guestLogin', {
        url: '/guest-login/:productId',
        views: {
          storeContent: {
            templateUrl: 'store/templates/guest-login.html',
            controller: 'GuestUserCtrl as ctrl'
          }
        }
      })
      .state('store.signup', {
        url: '/signup/:productId',
        views: {
          storeContent: {
            templateUrl: 'store/templates/guest-signup.html',
            controller: 'GuestSignupCtrl as ctrl'
          }
        }
      })
      .state('store.forgotPassword', {
        url: '/forgot-password/:productId',
        views: {
          storeContent: {
            templateUrl: 'store/templates/forgot-passwordG.html',
            controller: 'ForgotPasswordCtrlG as ctrl'
          }
        }
      })
      .state('store.changePassword', {
        url: '/change-password/:email/:productId',
        views: {
          storeContent: {
            templateUrl: 'store/templates/change-passwordG.html',
            controller: 'ForgotPasswordCtrlG as ctrl'
          }
        }
      });
  });
