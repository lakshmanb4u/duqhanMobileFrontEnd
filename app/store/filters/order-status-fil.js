'use strict';
angular.module('store')
.filter('orderStatusFilter', function ($log) {
  return function (input) {
    $log.log('input==========');
    $log.log(input);
    var status = 'Cancelled';
    if (input === 'created') {
      status = 'Waiting for Payment Approval';
    } else if (input === 'approved') {
      status = 'Payment Approved';
    }
    return status;
  };
});
