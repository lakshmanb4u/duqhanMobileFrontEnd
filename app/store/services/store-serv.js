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
      return $http.post(Config.ENV.SERVER_URL + 'user/get-product', param, {transformResponse: function (data) {
        return data.products;
      }});
    }
  };
});
