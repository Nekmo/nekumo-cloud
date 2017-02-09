/**
 * Created by nekmo on 10/01/17.
 */
var module = angular.module('videoPlayer', [
    "ngSanitize",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.buffering"
]);

module.directive('videoPlayer', function () {
    return {
        scope: {
            src: '=',
            mimeType: '='
        },
        templateUrl: '/.nekumo/static/src/shared/videoPlayer/videoPlayer.html'
    }
});

module.controller('videoPlayerCtrl', function ($scope, $sce, $chromecast) {
    var chromecastSrc = $scope.src;
    $scope.getUrl = function (url) {
        return $sce.trustAsResourceUrl(url);
    };

    $scope.srcData = [{src: $scope.getUrl($scope.src), type: $scope.mimeType}];
    if($scope.mimeType != 'video/mp4'){
        chromecastSrc = '/.nekumo/encode/' + chromecastSrc;
    }
    $chromecast.setSrc('http://192.168.88.11:7080/' + chromecastSrc);
});