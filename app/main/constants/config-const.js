'use strict';
angular.module('main')
.constant('Config', {

  // gulp environment: injects environment vars
  ENV: {
    /*inject-env*/
    'SERVER_URL': 'http://localhost:8084/',
    'SOME_OTHER_URL': '/postman-proxy',
    'USER': {
      'AUTH_TOKEN': null,
      'NAME': ''
    }
    /*endinject*/
  },

  // gulp build-vars: injects build vars
  BUILD: {
    /*inject-build*/
    /*endinject*/
  }

});
