'use strict';
angular.module('store')
.filter('cloudinaryThumbTransformation', function () {
  return function (input) {
    return input.replace('upload/', 'upload/w_150,h_150,c_pad,b_white/');
  };
})
.filter('cloudinaryImageTransformation', function () {
  return function (input) {
    return input.replace('upload/', 'upload/w_320,h_320,c_pad,b_white/');
  };
});
