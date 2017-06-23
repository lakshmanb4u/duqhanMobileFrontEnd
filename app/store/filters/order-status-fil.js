'use strict';
angular.module('store')
.filter('orderStatusFilter', function () {
  return function (input) {
    var status = 'Cancelled';
    if (input.status === 'created') {
      status = 'Waiting for Payment Approval';
    } else if (input.status === 'approved') {
      status = 'Order Complete';
      // status = input.trackerBean.status;
    }
    return status;
  };
});
