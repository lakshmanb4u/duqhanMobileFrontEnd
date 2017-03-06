'use strict';
angular.module('store')
.filter('cloudinaryThumbTransformation', function () {
  return function (input) {
    return input.replace('upload/', 'upload/w_500,h_500,c_pad,b_white/');
  };
})
.filter('cloudinaryImageTransformation', function () {
  return function (input) {
    return input.replace('upload/', 'upload/h_320,c_pad,b_white/');
  };
});
