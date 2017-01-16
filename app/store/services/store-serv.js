'use strict';
angular.module('store')
.factory('Store', function (
  $log,
  $http,
  Config
) {

  $log.log('Hello from your Service: Store in module store');

  return {
    getProducts: function (param) {
      // return $http.get('dummy/products.json');
      return $http.post(Config.ENV.SERVER_URL + 'user/get-product', param, {transformResponse: function (response) {
        var data = JSON.parse(response);
        return data.products;
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
    }
  };
});
