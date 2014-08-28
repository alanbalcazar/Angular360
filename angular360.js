angular.module('Angular360', []).directive('vrCube', ['$window', function($window) {
  return {
    restrict: 'E',
    transclude: true,
    template: '<div class="vr" ng-class="{fullscreen: fullscreen, debug: debug}">'
             +  '<div class="vr-viewport" style="width: {{size}}px; height:{{size}}px; perspective: {{size*0.5-1}}px; -webkit-perspective: {{size*0.5-1}}px; margin-left: {{marginLeft}}px; margin-top: {{marginTop}}px;">'
             +    '<div class="vr-cube" style="width: {{size}}px; height:{{size}}px; transform: translateZ({{size*0.5-1}}px) rotateX({{x}}deg) rotateY({{y}}deg); -webkit-transform: translateZ({{size*0.5-1}}px) rotateX({{x}}deg) rotateY({{y}}deg);">'
             +      '<div class="vr-cube-face vr-cube-face-front"  style="width: {{size}}px; height:{{size}}px; background-image: url(\'{{front}}\');  transform:                 translateZ(-{{size*0.5-1}}px); -webkit-transform:                 translateZ(-{{size*0.5-1}}px);">'
             +        '<a ng-repeat="marker in markers | filter:{face:\'front\'}" class="vr-marker" href="{{marker.href}}" target="{{marker.target}}" style="left: {{marker.region.left*100}}%; top: {{marker.region.top*100}}%; width: {{marker.region.width*100}}%; height: {{marker.region.height*100}}%;" ng-style="marker.style" ng-click="marker.onclick($event)"></a>'
             +      '</div>'
             +      '<div class="vr-cube-face vr-cube-face-left"   style="width: {{size}}px; height:{{size}}px; background-image: url(\'{{left}}\');   transform: rotateY(90deg)  translateZ(-{{size*0.5-1}}px); -webkit-transform: rotateY(90deg)  translateZ(-{{size*0.5-1}}px);">'
             +        '<a ng-repeat="marker in markers | filter:{face:\'left\'}" class="vr-marker" href="{{marker.href}}" target="{{marker.target}}" style="left: {{marker.region.left*100}}%; top: {{marker.region.top*100}}%; width: {{marker.region.width*100}}%; height: {{marker.region.height*100}}%;" ng-style="marker.style" ng-click="marker.onclick($event)"></a>'
             +      '</div>'
             +      '<div class="vr-cube-face vr-cube-face-right"  style="width: {{size}}px; height:{{size}}px; background-image: url(\'{{right}}\');  transform: rotateY(-90deg) translateZ(-{{size*0.5-1}}px); -webkit-transform: rotateY(-90deg) translateZ(-{{size*0.5-1}}px);">'
             +        '<a ng-repeat="marker in markers | filter:{face:\'right\'}" class="vr-marker" href="{{marker.href}}" target="{{marker.target}}" style="left: {{marker.region.left*100}}%; top: {{marker.region.top*100}}%; width: {{marker.region.width*100}}%; height: {{marker.region.height*100}}%;" ng-style="marker.style" ng-click="marker.onclick($event)"></a>'
             +      '</div>'
             +      '<div class="vr-cube-face vr-cube-face-back"   style="width: {{size}}px; height:{{size}}px; background-image: url(\'{{back}}\');   transform: rotateY(180deg) translateZ(-{{size*0.5-1}}px); -webkit-transform: rotateY(180deg) translateZ(-{{size*0.5-1}}px);">'
             +        '<a ng-repeat="marker in markers | filter:{face:\'back\'}" class="vr-marker" href="{{marker.href}}" target="{{marker.target}}" style="left: {{marker.region.left*100}}%; top: {{marker.region.top*100}}%; width: {{marker.region.width*100}}%; height: {{marker.region.height*100}}%;" ng-style="marker.style" ng-click="marker.onclick($event)"></a>'
             +      '</div>'
             +      '<div class="vr-cube-face vr-cube-face-top"    style="width: {{size}}px; height:{{size}}px; background-image: url(\'{{top}}\');    transform: rotateX(-90deg) translateZ(-{{size*0.5-1}}px); -webkit-transform: rotateX(-90deg) translateZ(-{{size*0.5-1}}px);">'
             +        '<a ng-repeat="marker in markers | filter:{face:\'top\'}" class="vr-marker" href="{{marker.href}}" target="{{marker.target}}" style="left: {{marker.region.left*100}}%; top: {{marker.region.top*100}}%; width: {{marker.region.width*100}}%; height: {{marker.region.height*100}}%;" ng-style="marker.style" ng-click="marker.onclick($event)"></a>'
             +      '</div>'
             +      '<div class="vr-cube-face vr-cube-face-bottom" style="width: {{size}}px; height:{{size}}px; background-image: url(\'{{bottom}}\'); transform: rotateX(90deg)  translateZ(-{{size*0.5-1}}px); -webkit-transform: rotateX(90deg)  translateZ(-{{size*0.5-1}}px);">'
             +        '<a ng-repeat="marker in markers | filter:{face:\'bottom\'}" class="vr-marker" href="{{marker.href}}" target="{{marker.target}}" style="left: {{marker.region.left*100}}%; top: {{marker.region.top*100}}%; width: {{marker.region.width*100}}%; height: {{marker.region.height*100}}%;" ng-style="marker.style" ng-click="marker.onclick($event)"></a>'
             +      '</div>'
             +    '</div>'
             +  '</div>'
             +'</div>'
             +'<div ng-transclude style="position: absolute;"></div>',
    scope: {
      x:          '=?',
      y:          '=?',
      size:       '=?',
      fullscreen: '=?',
      front:      '@',
      left:       '@',
      right:      '@',
      back:       '@',
      top:        '@',
      bottom:     '@',
      markers:    '=',
      debug:      '=?'
    },
    controller: ['$scope', '$window', function($scope, $window) {
      // default values
      $scope.x = $scope.x || 0;
      $scope.y = $scope.y || 0;

      // set fullscreen enable if not set
      if (!angular.isDefined($scope.fullscreen)) {
        $scope.fullscreen = true;
      }

      if ($scope.fullscreen) {
        setFullscreen();

        // handle window size change
        angular.element($window).on('resize', function() {
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
      // Last event's position.
      var lastPos;
      // Whether a swipe is active.
      var active = false;

      var scrollSensitivity;

      setScrollSensitivity();
      angular.element($window).on('resize', setScrollSensitivity);

      element.on('touchstart mousedown', function(event) {
        lastPos = getCoordinates(event);
        active = true;
      }).on('touchcancel', function(event) {
        active = false;
      }).on('touchmove mousemove', function(event) {
        if (!active) return;

        var coords = getCoordinates(event);
        var dx = (coords.x - lastPos.x) * scrollSensitivity;
        var dy = (coords.y - lastPos.y) * scrollSensitivity;

        // rotate view
        scope.y -= dx;
        scope.x += dy;

        // prevent over rotation by X
        if (scope.x > 90) {
          scope.x = 90;
        } else if (scope.x < -90) {
          scope.x = -90;
        }

        lastPos = coords;
        event.preventDefault();
        scope.$apply();
      }).on('touchend mouseup', function(event) {
        active = false;
      });

      // put transclude contents (need jQuery)
      element.find('.vr-cube-face-front').append(element.find('vr-front'));
      element.find('.vr-cube-face-left').append(element.find('vr-left'));
      element.find('.vr-cube-face-right').append(element.find('vr-right'));
      element.find('.vr-cube-face-back').append(element.find('vr-back'));
      element.find('.vr-cube-face-top').append(element.find('vr-top'));
      element.find('.vr-cube-face-bottom').append(element.find('vr-bottom'));

      function setScrollSensitivity() {
        // scrolling device's left edge to right edge equals 360 rotation
        scrollSensitivity = 360 / $window.innerWidth;
      }
    }
  }

  /**
   * from angular-touch.js
   */
  function getCoordinates(event) {
    var touches = event.touches && event.touches.length ? event.touches : [event];
    var e = (event.changedTouches && event.changedTouches[0]) ||
        (event.originalEvent && event.originalEvent.changedTouches &&
            event.originalEvent.changedTouches[0]) ||
        touches[0].originalEvent || touches[0];

    return {
      x: e.clientX,
      y: e.clientY
    };
  }
}]);