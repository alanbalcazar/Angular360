angular.module('Angular360', ['ngTouch']).directive('vrCube', ['$swipe', function($swipe) {
  return {
    restrict: 'E',
    template: '<div class="vr" ng-mousedown="$event.preventDefault()" ng-class="{\'fullscreen\': fullscreen}">'
             +  '<div class="vr-viewport" style="width: {{size}}px; height:{{size}}px; perspective: {{size*0.5-1}}px; margin-left: {{marginLeft}}px; margin-top: {{marginTop}}px;">'
             +    '<div class="vr-cube" style="width: {{size}}px; height:{{size}}px; transform: translateZ({{size*0.5-1}}px) rotateX({{x}}deg) rotateY({{y}}deg)">'
             +      '<div class="vr-cube-face vr-cube-face-front"  style="width: {{size}}px; height:{{size}}px; transform:                 translateZ(-{{size*0.5-1}}px); background-image: url(\'{{front}}\');"></div>'
             +      '<div class="vr-cube-face vr-cube-face-left"   style="width: {{size}}px; height:{{size}}px; transform: rotateY(90deg)  translateZ(-{{size*0.5-1}}px); background-image: url(\'{{left}}\');"></div>'
             +      '<div class="vr-cube-face vr-cube-face-right"  style="width: {{size}}px; height:{{size}}px; transform: rotateY(-90deg) translateZ(-{{size*0.5-1}}px); background-image: url(\'{{right}}\');"></div>'
             +      '<div class="vr-cube-face vr-cube-face-back"   style="width: {{size}}px; height:{{size}}px; transform: rotateY(180deg) translateZ(-{{size*0.5-1}}px); background-image: url(\'{{back}}\');"></div>'
             +      '<div class="vr-cube-face vr-cube-face-top"    style="width: {{size}}px; height:{{size}}px; transform: rotateX(-90deg) translateZ(-{{size*0.5-1}}px); background-image: url(\'{{top}}\');"></div>'
             +      '<div class="vr-cube-face vr-cube-face-bottom" style="width: {{size}}px; height:{{size}}px; transform: rotateX(90deg)  translateZ(-{{size*0.5-1}}px); background-image: url(\'{{bottom}}\');"></div>'
             +    '</div>'
             +  '</div>'
             +'</div>',
    scope: {
      x:      '=?',
      y:      '=?',
      size:   '=?',
      fullscreen: '=?',
      front:  '=',
      left:   '=',
      right:  '=',
      back:   '=',
      top:    '=',
      bottom: '='
    },
    controller: ['$scope', '$interval', '$window', function($scope, $interval, $window) {
      // default rotation values
      $scope.x = $scope.x || 0;
      $scope.y = $scope.y || 0;

      // set fullscreen enable if not set
      if (!angular.isDefined($scope.fullscreen)) {
        $scope.fullscreen = true;
      }

      if ($scope.fullscreen) {
        setFullscreen();

        // handle window size change
        $window.addEventListener('resize', function() {
          setFullscreen();
          $scope.$apply();
        });
      } else {
        $scope.size = $scope.size || Math.min($window.innerWidth, $window.innerHeight);
      }

      function setFullscreen() {
        // set size to cover whole window
        $scope.size = Math.max($window.innerWidth, $window.innerHeight);

        // centering
        $scope.marginLeft = ($window.innerWidth  - $scope.size) * 0.5;
        $scope.marginTop  = ($window.innerHeight - $scope.size) * 0.5;
        
      }
    }],
    link: function(scope, element) {
      // enable gesture control
      var preTouchPosition;

      $swipe.bind(element, {
        start: function(e) {
          preTouchPosition = e;
        },
        move: function(e) {
          scope.y -= e.x - preTouchPosition.x;
          scope.x += e.y - preTouchPosition.y;

          if (scope.x > 90) {
            scope.x = 90;
          } else if (scope.x < -90) {
            scope.x = -90;
          }

          preTouchPosition = e;
          scope.$apply();
        }
      });
    }
  }
}]);