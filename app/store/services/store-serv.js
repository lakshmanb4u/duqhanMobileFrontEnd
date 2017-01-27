'use strict';
angular.module('store')
.factory('Store', function (
  $log,
  $http,
  $q,
  Config
) {

  $log.log('Hello from your Service: Store in module store');

  return {
    getProducts: function (param) {
      // return $http.get('dummy/products.json');
      return $http.post(Config.ENV.SERVER_URL + 'user/get-product', param, {transformResponse: function (response) {
        var data = JSON.parse(response);
        return data;
      }});
    },
    getProductDetail: function (param) {
      // return $http.get('dummy/products.json');
      return $http.post(Config.ENV.SERVER_URL + 'user/get-product-detail', param, {transformResponse: function (response) {
        var data = JSON.parse(response);
        return data;
      }});
    },
    addToCart: function (param) {
      return $http.post(Config.ENV.SERVER_URL + 'user/add-to-cart', param, {transformResponse: function (response) {
        var data = JSON.parse(response);
        return data;
      }});
    },
    getCart: function () {
      return $http.post(Config.ENV.SERVER_URL + 'user/cart', {transformResponse: function (response) {
        var data = JSON.parse(response);
        return data;
      }});
    },
    getCartTotalNumber: function () {
      return $http.post(Config.ENV.SERVER_URL + 'user/get-cart-count', {transformResponse: function (response) {
        var data = JSON.parse(response);
        return data;
      }});
    },
    removeFromCart: function (param) {
      return $http.post(Config.ENV.SERVER_URL + 'user/remove-from-cart', param, {transformResponse: function (response) {
        var data = JSON.parse(response);
        return data;
      }});
    },
    getProfileDetails: function () {
      return $http.post(Config.ENV.SERVER_URL + 'user/get-profile-details', {transformResponse: function (response) {
        var data = JSON.parse(response);
        return data;
      }});
    },
    updateProfileDetails: function (user) {
      return $http.post(Config.ENV.SERVER_URL + 'user/update-profile-details', user, {transformResponse: function (response) {
        var data = JSON.parse(response);
        return data;
      }});
    },
    updateProfileImage: function (image) {
      return $http.post(Config.ENV.SERVER_URL + 'user/update-profile-image', image, {transformResponse: function (response) {
        var data = JSON.parse(response);
        return data;
      }});
    },
    getChildCategories: function (categoryId) {
      var category = {};
      category.categoryId = categoryId;
      return $http.post(Config.ENV.SERVER_URL + 'get-child-category', category, {transformResponse: function (response) {
        var data = JSON.parse(response);
        return data;
      }});
    },
    saveAddress: function (address) {
      return $http.post(Config.ENV.SERVER_URL + 'user/save-address', address, {transformResponse: function (response) {
        var data = JSON.parse(response);
        return data;
      }});
    },
    getAddresses: function () {
      return $http.post(Config.ENV.SERVER_URL + 'user/get-addresses', {transformResponse: function (response) {
        var data = JSON.parse(response);
        return data;
      }});
    }
  };
});
