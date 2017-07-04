'use strict';
angular.module('main')
.constant('Config', {

  // gulp environment: injects environment vars
  ENV: {
    /*inject-env*/
    'SERVER_URL': 'http://duqhan-api.aq3cm3hjga.us-east-1.elasticbeanstalk.com/',
    'SOME_OTHER_URL': 'http://192.168.1.95:8084/',
    'USER': {
      'AUTH_TOKEN': null,
      'NAME': '',
      'PROFILE_IMG': '',
      'LATITUDE': null,
      'LONGITUDE': null,
      'USER_AGENT': null
    },
    'CLOUDINARY': {
      'CLOUD_NAME': 'duqhan',
      'API_KEY': '211572778157664',
      'API_SECRET': 'BjqvouftX41P4NHFbAEPFaBWFog'
    },
    'PRODUCTS_PER_PAGE': 20
    /*endinject*/
  },

  // gulp build-vars: injects build vars
  BUILD: {
    /*inject-build*/
    /*endinject*/
  }
});
