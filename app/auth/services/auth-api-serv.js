'use strict';
angular.module('auth')
.factory('Auth', function ($log, $http, Config) {

  $log.log('Hello from your Service: AuthAPI in module auth');

  return {
    login: function (user) {
      return $http.post(Config.ENV.SERVER_URL + 'login', user);
    },

    signup: function (user) {
      return $http.post(Config.ENV.SERVER_URL + 'signup', user);
    },

    requestPasswordReset: function (user) {
      return $http.post(Config.ENV.SERVER_URL + 'request-password-reset', user);
    },

    confirmPasswordReset: function (user) {
      return $http.post(Config.ENV.SERVER_URL + 'confirm-password_reset', user);
    },

    fbLogin: function (user) {
      return $http.post(Config.ENV.SERVER_URL + 'fb-login', user);
    },

    logout: function (user) {
      return $http.post(Config.ENV.SERVER_URL + 'user/logout', user);
    }
  };
});
