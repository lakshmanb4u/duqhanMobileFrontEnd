'use strict';
angular
  .module('main')
  .factory('HttpInterceptor', function (
    BusyLoader,
    $q,
    $log,
    Config,
    $localStorage,
    $rootScope
  ) {
    var loadingCount = 0;
    return {
      request: function (config) {
        if (!Config.ENV.USER.AUTH_TOKEN) {
          var savedUser = $localStorage.savedUser;
          if (savedUser && JSON.parse(savedUser)) {
            var parsedUser = JSON.parse(savedUser);
            if (parsedUser.authtoken) {
              Config.ENV.USER.AUTH_TOKEN = parsedUser.authtoken;
              Config.ENV.USER.NAME = parsedUser.name;
            }
          }
        }
        if (
          config.url.indexOf(Config.ENV.SERVER_URL + 'user') === 0 &&
          Config.ENV.USER.AUTH_TOKEN
        ) {
          config.headers['X-Auth-Token'] = Config.ENV.USER.AUTH_TOKEN;
        }
        if (++loadingCount === 1) {
          $rootScope.$broadcast('loading:progress');
          if (
            !(config.url.indexOf(Config.ENV.SERVER_URL + 'user/get-product') ===
              0 && config.data.start > 0) && config.url.indexOf('.html') < 0
          ) {
            BusyLoader.show();
          }
        }
        return config;
      },
      response: function (res) {
        if (--loadingCount === 0) {
          $rootScope.$broadcast('loading:finish');
          BusyLoader.hide();
        }
        return res;
      },
      requestError: function (err) {
        return err;
      },
      responseError: function (err) {
        if (err.status === 401) {
          $rootScope.$emit('Unauthorized');
        }
        if (--loadingCount === 0) {
          $rootScope.$broadcast('loading:finish');
          BusyLoader.hide();
        }
        return $q.reject(err);
      }
    };
  });
