'use strict';
angular.module( 'store' )
  .directive( 'horizontalTab', function () {
    return {
      template: '<div class="hscroller" ng-transclude></div>',
      restrict: 'E',
      transclude: true,
      compile: function () {
        return function ( $scope, $element ) {
          angular.element( $element ).bind( 'scroll' );
        };
      }
    };
  } )
  .directive( 'hcard', function () {
    return {
      restrict: 'E',
      template: '<div class="hscroller-card" ng-transclude></div>',
      replace: true,
      transclude: true,
      scope: {
        desc: '@',
        image: '@',
        index: '@'
      },
      link: function ( scope, element, attrs ) {
        var img = angular.element( '<div class="hscroller-img" >' + attrs.desc + '</div>' );
        element.append( img );
        var animationClass = 'hscroller-card-animated-' + attrs.index.toString();
        element.addClass( animationClass );

      },

    };
  } );
