'use strict';
angular.module('main')
.constant('Config', {

  // gulp environment: injects environment vars
  ENV: {
    /*inject-env*/
    'SERVER_URL': 'http://sample-env.qtbvngb2iz.us-west-2.elasticbeanstalk.com/',
    'SOME_OTHER_URL': 'https://echo.getpostman.com/',
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
