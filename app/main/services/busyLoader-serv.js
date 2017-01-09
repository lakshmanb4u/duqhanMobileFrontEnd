'use strict';
angular.module('main')
.factory('BusyLoader', ['$injector', function ($injector) {
  return {
    show: function (content) {
      $injector.get('$ionicLoading').show({
        content: content || 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    },

    hide: function () {
      $injector.get('$ionicLoading').hide();
    }
  };
}]);
