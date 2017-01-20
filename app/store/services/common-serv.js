'use strict';
angular.module('store')
.factory('Common', function ($log, $q, $ionicPopup) {

  $log.log('Hello from your Service: Common in module store');

  return {
    getConfirmation: function (title, cancelText, okText) {
      var q = $q.defer();
      var confirmPopup = $ionicPopup.confirm({
        title: title, // String. The title of the popup.
        cancelText: cancelText, // String (default: 'Cancel'). The text of the Cancel button.
        cancelType: 'button-stable', // String (default: 'button-default'). The type of the Cancel button.
        okText: okText, // String (default: 'OK'). The text of the OK button.
        okType: 'button-energized', // String (default: 'button-positive'). The type of the OK button.
      });

      confirmPopup.then(function (res) {
        if (res) {
          q.resolve(res);
        } else {
          q.reject();
        }
      });

      return q.promise;
    }
  };

});
