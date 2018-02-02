'use strict';
angular.module('main')
  .constant('Config', {

    // gulp environment: injects environment vars
    ENV: {
      /*inject-env*/
      'SERVER_URL': 'https://duqhan.com/api/',
    'SOME_OTHER_URL': 'http://duqhan-staging.aq3cm3hjga.us-east-1.elasticbeanstalk.com/',
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
    'PRODUCTS_PER_PAGE': 20,
    'DEEP_LINK': null
      /*endinject*/
    },

    // gulp build-vars: injects build vars
    BUILD: {
      /*inject-build*/
      /*endinject*/
    }
  });
