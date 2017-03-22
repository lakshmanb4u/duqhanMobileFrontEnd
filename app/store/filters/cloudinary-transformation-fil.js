'use strict';
angular.module('store')
.filter('cloudinaryThumbTransformation', function () {
  return function (input) {
    return input.replace('upload/', 'upload/w_500,h_500,c_pad,b_white/');
  };
})
.filter('cloudinaryImageTransformation', function () {
  return function (input) {
    return input.replace('upload/', 'upload/w_768,h_768,c_pad,b_white/');
  };
});
