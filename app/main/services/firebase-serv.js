'use strict';
angular.module('main')
.factory('Firebase', function ($log, $q) {

  $log.log('Hello from your Service: Firebase in module main');

  return {
    includeFCMToken: function (user) {
      var q = $q.defer();
      if (!ionic.Platform.is('browser')) {
        // eslint-disable-next-line no-undef
        FCMPlugin.getToken( function (token) {
          user.fcmToken = token;
          q.resolve(user);
        });
      } else {
        q.resolve(user);
      }
      return q.promise;
    }
  };

});
