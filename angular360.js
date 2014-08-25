angular.module('Angular360', ['ngTouch']).directive('vrCube', function() {
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
    controller: function($scope, $interval, $swipe, $window) {
      // デフォルトでフルスクリーンモード
      if (!angular.isDefined($scope.fullscreen)) {
        $scope.fullscreen = true;
      }

      if ($scope.fullscreen) {
        // VRサイズをウィンドウサイズの長辺に合わせる
        setFullscreen();
        $window.addEventListener('resize', setFullscreen);
      } else {
        $scope.size = $scope.size || Math.min($window.innerWidth, $window.innerHeight);
      }

      // 初期回転座標
      $scope.x = $scope.x || 0;
      $scope.y = $scope.y || 0;

      // スワイプイベント設定
      $swipe.bind(angular.element(document.querySelector('.vr')), {
        start: function(e) {
          $scope.preTouchPosition = e;
        },
        move: function(e) {
          $scope.y -= e.x - $scope.preTouchPosition.x;
          $scope.x += e.y - $scope.preTouchPosition.y;

          if ($scope.x > 90) {
            $scope.x = 90;
          } else if ($scope.x < -90) {
            $scope.x = -90;
          }

          $scope.preTouchPosition = e;
          $scope.$apply();
        }
      });

      function setFullscreen() {
        $scope.size = Math.max($window.innerWidth, $window.innerHeight);

        // 中央配置
        $scope.marginLeft = ($window.innerWidth  - $scope.size) * 0.5;
        $scope.marginTop  = ($window.innerHeight - $scope.size) * 0.5;
        $scope.$apply();
      }
    }
  }
});