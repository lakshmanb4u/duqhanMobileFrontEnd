'use strict';
angular.module('exTabModule')
.service('ExTabModule', function ($log, $timeout) {

  $log.log('Hello from your Service: ExTabModule in module exTabModule');

  // some initial data
  this.someData = {
    binding: 'Yes! Got that databinding working'
  };

  this.changeBriefly = function () {
    var initialValue = this.someData.binding;
    this.someData.binding = 'Yeah this was changed';

    var that = this;
    $timeout(function () {
      that.someData.binding = initialValue;
    }, 500);
  };

});
