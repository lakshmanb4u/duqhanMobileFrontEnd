'use strict';
angular.module('store')
.filter('dateFilter', function (moment) {
  return function (input) {
    return moment(input, 'DD/MM/YYYY').format('ddd, MMM Do, YYYY');
  };
});
