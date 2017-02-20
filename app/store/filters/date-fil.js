'use strict';
angular.module('store')
.filter('dateFilter1', function (moment) {
  return function (input) {
    return moment(input, 'DD/MM/YYYY').format('ddd, MMM Do, YYYY');
  };
})
.filter('dateFilter2', function (moment) {
  return function (input) {
    return moment(input, 'DD/MM/YYYY').format('Do MMM');
  };
});
