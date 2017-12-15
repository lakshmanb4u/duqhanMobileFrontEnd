'use strict';
angular.module('store')
  .factory('Store', function (
    $log,
    $http,
    $q,
    $cordovaFileTransfer,
    Config
  ) {

    $log.log('Hello from your Service: Store in module store');

    return {
      getProducts: function (param) {
        // return $http.get('dummy/products.json');
        return $http.post(Config.ENV.SERVER_URL + 'user/get-product', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getFreeProducts: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-free-product', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      searchProduct: function (param) {
        // return $http.get('dummy/products.json');
        return $http.post(Config.ENV.SERVER_URL + 'user/search-product', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getProductDetail: function (param) {
        // return $http.get('dummy/products.json');
        return $http.post(Config.ENV.SERVER_URL + 'user/get-product-detail', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      addToCart: function (param) {
        return $http.post(Config.ENV.SERVER_URL + 'user/add-to-cart', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getProductReviews: function (param) {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-product-reviews', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      saveRecentRecord: function (param) {
        return $http.post(Config.ENV.SERVER_URL + 'user/save-recent-record', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getLikeUnlike: function (param) {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-like-unlike', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      setPropertyRecored: function (param) {
        return $http.post(Config.ENV.SERVER_URL + 'user/set-property-record', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getCart: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/cart', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getCartTotalNumber: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-cart-count', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      removeFromCart: function (param) {
        return $http.post(Config.ENV.SERVER_URL + 'user/remove-from-cart', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getProfileDetails: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-profile-details', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      updateProfileDetails: function (user) {
        return $http.post(Config.ENV.SERVER_URL + 'user/update-profile-details', user, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      saveReview: function (param) {
        return $http.post(Config.ENV.SERVER_URL + 'user/save-review', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      updateProfileImage: function (filePath, id) {
        var q = $q.defer();
        var options = {};
        options.fileKey = 'file';
        options.fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
        options.mimeType = 'image/jpeg';
        options.chunkedMode = false;
        options.params = {
          userId: id
        };
        var server = encodeURI(Config.ENV.SERVER_URL + 'user/update-profile-image');

        $cordovaFileTransfer.upload(server, filePath, options)
          .then(function (result) {
            q.resolve(result);
          }, function (err) {
            q.reject(err);
          });
        return q.promise;
      },
      getChildCategories: function (categoryId) {
        var category = {};
        category.categoryId = categoryId;
        return $http.post(Config.ENV.SERVER_URL + 'get-child-category', category, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getChildCategoriesById: function (categoryId) {
        var category = {};
        category.categoryId = categoryId;
        return $http.post(Config.ENV.SERVER_URL + 'get-child-category-byid', category, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      saveAddress: function (address) {
        return $http.post(Config.ENV.SERVER_URL + 'user/save-address', address, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      setDefaultAddress: function (id) {
        var address = {};
        address.addressId = id;
        return $http.post(Config.ENV.SERVER_URL + 'user/set-default-addresses', address, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getAddresses: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-addresses', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getDefaultAddress: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-default-addresses', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      deactivateAddress: function (id) {
        var address = {};
        address.addressId = id;
        return $http.post(Config.ENV.SERVER_URL + 'user/deactivate-address', address, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getUserEmailAndPhone: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-user-email-phone', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      setUserEmailAndPhone: function (email) {
        return $http.post(Config.ENV.SERVER_URL + 'user/set-user-email-phone', email, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      checkout: function (cart) {
        return $http.post(Config.ENV.SERVER_URL + 'user/checkout', cart, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      checkPaymentStatus: function (payKey) {
        var obj = {};
        obj.name = payKey;
        return $http.post(Config.ENV.SERVER_URL + 'user/check-payment-status', obj, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getOrderHistory: function (param) {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-order-details', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getShippingDetails: function (cart) {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-shipment', cart, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getFAQ: function () {
        return $http.get('http://res.cloudinary.com/duqhan/raw/upload/v1488785100/support/support.json');
      },
      cancelOrd: function (order) {
        return $http.post(Config.ENV.SERVER_URL + 'user/cancel-order', order, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      contactUs: function (details) {
        return $http.post(Config.ENV.SERVER_URL + 'user/contact-us', details);
      },
      purchaseFreeProduct: function (cart) {
        return $http.post(Config.ENV.SERVER_URL + 'user/accept-free-product-offer', cart, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      likeUnlikeProduct: function (likeUnlikeData) {
        return $http.post(Config.ENV.SERVER_URL + 'user/likeUlike', likeUnlikeData, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      returnOrderReq: function (filePath, orderId, text,authToken) {
        var q = $q.defer();
        var options = {};
        options.fileKey = 'file';
        options.fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
        options.mimeType = 'image/jpeg';
        options.chunkedMode = false;
        options.params = {
          orderId: orderId,
          returnText: text,
          authToken: authToken
        };
        var server = encodeURI(Config.ENV.SERVER_URL + 'user/order/request_return');

        $cordovaFileTransfer.upload(server, filePath, options)
          .then(function (result) {
            q.resolve(result);
          }, function (err) {
            q.reject(err);
          });
        return q.promise;
      }
    };
  });
