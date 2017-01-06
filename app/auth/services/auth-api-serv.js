'use strict';
angular.module('auth')
.factory('Auth', function ($log, $http, AuthConfig) {

  $log.log('Hello from your Service: AuthAPI in module auth');

  return {
    login: function (user) {
      return $http.post(AuthConfig.ENV.SERVER_URL + 'login', user);
    },

    signup: function (user) {
      return $http.post(AuthConfig.ENV.SERVER_URL + 'signup', user);
    },

    requestPasswordReset: function (email) {
      return $http.post(AuthConfig.ENV.SERVER_URL + 'request-password-reset', email);
    },

    confirmPasswordReset: function (user) {
      return $http.post(AuthConfig.ENV.SERVER_URL + 'confirm-password_reset', user);
    }
  };
});
