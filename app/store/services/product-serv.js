'use strict';
angular.module('store')
.factory('Product', function ($log, $ImageCacheFactory, $q, Store, BusyLoader) {

  $log.log('Hello from your Service: Product in module store');

  return {
    getProductList: function (productsParam) {
      var q = $q.defer();

      Store.getProducts(productsParam)
      .then(function (response) {
        BusyLoader.show();
        $log.log(response);
        $ImageCacheFactory.Cache(response.data.allImages)
        .then(function () {
          BusyLoader.hide();
          q.resolve(response.data.products);
        });
      })
      .catch(function (err) {
        $log.log(err);
        q.reject(err);
      });

      return q.promise;
    },
    getChildCategories: function (categoryId) {
      var q = $q.defer();

      Store.getChildCategories(categoryId)
      .then(function (response) {
        $log.log(response);
        q.resolve(response.data.categoryDtos);
      })
      .catch(function (err) {
        $log.log(err);
        q.reject(err);
      });

      return q.promise;
    }
  };
});
