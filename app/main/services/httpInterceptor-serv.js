'use strict';
angular.module('main')
.factory('HttpInterceptor', function (BusyLoader, $q, $log, Config) {

  return {
    request: function (config) {
      BusyLoader.show();
      if (config.url.indexOf(Config.ENV.SERVER_URL + 'user') !== 0 && Config.ENV.USER.AUTH_TOKEN) {
        config.headers['X-Auth-Token'] = Config.ENV.USER.AUTH_TOKEN;
      }
      return config;
    },
    response: function (res) {
      // if (res.config.url.indexOf(Config.ENV.SERVER_URL + 'login') === 0 && res.data) {
      //   Config.ENV.USER.AUTH_TOKEN = data.authtoken;
      // }
      BusyLoader.hide();
      return res;
    },
    requestError: function (err) {
      BusyLoader.hide();
      $log.log('Request Error logging via interceptor');
      return err;
    },
    responseError: function (err) {
      BusyLoader.hide();
      $log.log('Response error via interceptor');
      return $q.reject(err);
    }
  };

});
