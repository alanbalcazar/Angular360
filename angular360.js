angular.module('Angular360', []).directive('vrCube', ['$window', function($window) {
  return {
    restrict: 'E',
    transclude: true,
    template: '<div class="vr" ng-class="{fullscreen: fullscreen, debug: debug}">'
             +  '<div class="vr-viewport" style="width: {{size}}px; height:{{size}}px; perspective: {{scale*size*0.5-1}}px; -webkit-perspective: {{scale*size*0.5-1}}px; margin-left: {{marginLeft}}px; margin-top: {{marginTop}}px;">'
             +    '<div class="vr-cube" style="width: {{size}}px; height:{{size}}px; transform: translateZ({{scale*size*0.5-1}}px) rotateX({{x}}deg) rotateY({{y}}deg); -webkit-transform: translateZ({{scale*size*0.5-1}}px) rotateX({{x}}deg) rotateY({{y}}deg);">'
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
      scale:      '=?',
      size:       '=?',
      fullscreen: '=?',
      front:      '@',
      left:       '@',
      right:      '@',
      back:       '@',
      top:        '@',
      bottom:     '@',
      markers:    '=',
      gyro:       '=?',
      debug:      '=?'
    },
    controller: ['$scope', '$window', function($scope, $window) {
      // default values
      $scope.x = $scope.x || 0;
      $scope.y = $scope.y || 0;
      $scope.scale = $scope.scale || 1;
      $scope.offsetX = 0;
      $scope.offsetY = 0;

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

      // touch support
      element.on('touchstart mousedown', function(event) {
        lastPos = getCoordinates(event);
        active = true;
      }).on('touchcancel', function(event) {
        active = false;
      }).on('touchmove mousemove', function(event) {
        if (!active) return;

        var coords = getCoordinates(event);
        var dx = (coords.x - lastPos.x) * scrollSensitivity / scope.scale;
        var dy = (coords.y - lastPos.y) * scrollSensitivity / scope.scale;

        // rotate view
        scope.y -= dx;
        scope.x += dy;
        scope.offsetY -= dx;

        // prevent over rotation by X
        if (scope.x > 90) {
          scope.x = 90;
        } else if (scope.x < -90) {
          scope.x = -90;
        } else {
          scope.offsetX += dy;
        }

        lastPos = coords;
        event.preventDefault();
        scope.$apply();
      }).on('touchend mouseup', function(event) {
        active = false;
      });

      // iOS hack (http://blog.choilabo.com/20120316/18)
      element.parent().on('touchstart touchmove touchend', angular.noop);

      // gyro
      if ($window.DeviceOrientationEvent) {
        $window.addEventListener('deviceorientation', new DeviceOrientationHandler(scope));
      }

      // mouse wheel
      window.document.addEventListener('mousewheel', function(e) {
        if (e.wheelDelta > 0) {
          scope.scale *=1.1;
        } else {
          scope.scale *= 0.9;
        }

        // prevent over scale
        if (scope.scale < 0.25) {
          scope.scale = 0.25;
        } else if (scope.scale > 4) {
          scope.scale = 4;
        }

        scope.$apply();
      });

      function setScrollSensitivity() {
        // scrolling device's left edge to right edge equals 360 rotation
        scrollSensitivity = (360 / $window.innerWidth + 180 / $window.innerHeight) * 0.5;
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

  function DeviceOrientationHandler(scope) {
    var degRad = Math.PI / 180,
      hLookAt = 0,
      vLookAt = 0,
      friction = 0.5;

    return function(event) {
      if (!scope.gyro) return;

      var deviceOrientation = top.orientation,
        orientation = rotateEuler({
          yaw: event.alpha * degRad,
          pitch: event.beta * degRad,
          roll: event.gamma * degRad
        }),
        yaw = wrapAngle(orientation.yaw / degRad),
        pitch = orientation.pitch / degRad,
        altYaw = yaw,
        factor,
        hLookAtNow = hLookAt,
        vLookAtNow = vLookAt;

      // Fix gimbal lock
      if (Math.abs(pitch) > 70) {
        altYaw = event.alpha;

        switch (deviceOrientation) {
          case 0:
            if (pitch > 0)
              altYaw += 180;
            break;
          case 90:
            altYaw += 90;
            break;
          case -90:
            altYaw += -90;
            break;
          case 180:
            if (pitch < 0)
              altYaw += 180;
            break;
        }

        altYaw = wrapAngle(altYaw);
        if (Math.abs(altYaw - yaw) > 180)
          altYaw += (altYaw < yaw) ? 360 : -360;

        factor = Math.min(1, (Math.abs(pitch) - 70) / 10);
        yaw = yaw * (1 - factor) + altYaw * factor;
      }

      hLookAt = wrapAngle(-yaw - 180);
      vLookAt = Math.max(Math.min((pitch), 90), -90);

      // Dampen lookat
      if (Math.abs(hLookAt - hLookAtNow) > 180)
        hLookAtNow += (hLookAt > hLookAtNow) ? 360 : -360;

      hLookAt = (1 - friction) * hLookAt + friction * hLookAtNow;
      vLookAt = (1 - friction) * vLookAt + friction * vLookAtNow;

      scope.y = wrapAngle(hLookAt) + scope.offsetY;
      scope.x = -vLookAt + scope.offsetX;
      scope.$apply();

      function rotateEuler(euler) {
        // This function is based on http://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToMatrix/index.htm
        // and http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToEuler/index.htm

        var heading, bank, attitude,
          ch = Math.cos(euler.yaw),
          sh = Math.sin(euler.yaw),
          ca = Math.cos(euler.pitch),
          sa = Math.sin(euler.pitch),
          cb = Math.cos(euler.roll),
          sb = Math.sin(euler.roll),

          matrix = [
            sh * sb - ch * sa * cb, -ch * ca, ch * sa * sb + sh * cb,
            ca * cb, -sa, -ca * sb,
            sh * sa * cb + ch * sb, sh * ca, -sh * sa * sb + ch * cb
          ]; // Note: Includes 90 degree rotation around z axis

        /* [m00 m01 m02] 0 1 2
         * [m10 m11 m12] 3 4 5
         * [m20 m21 m22] 6 7 8 */

        if (matrix[3] > 0.9999) {
          // Deal with singularity at north pole
          heading = Math.atan2(matrix[2], matrix[8]);
          attitude = Math.PI / 2;
          bank = 0;
        } else if (matrix[3] < -0.9999) {
          // Deal with singularity at south pole
          heading = Math.atan2(matrix[2], matrix[8]);
          attitude = -Math.PI / 2;
          bank = 0;
        } else {
          heading = Math.atan2(-matrix[6], matrix[0]);
          bank = Math.atan2(-matrix[5], matrix[4]);
          attitude = Math.asin(matrix[3]);
        }

        return {
          yaw: heading,
          pitch: attitude,
          roll: bank
        };
      }

      function wrapAngle(value) {
        value = value % 360;
        return (value <= 180) ? value : value - 360;
      } // wrap a value between -180 and 180
    }
  }
}]);