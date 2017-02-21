/**
 * Created by nekmo on 10/01/17.
 */
Promise.all([
    require('angular'),
    require('videogular'),
    require("videogular-buffering"),
    require("videogular-controls"),
    require("videogular-overlay-play"),
    require("shared/chromecast/chromecast"),

    require('src/libs/npm/videogular-themes-default@1.4.4/videogular.css!css'),
    require('src/shared/videoPlayer/chromecast.css!css')
]).then(function () {

    var module = angular.module('videoPlayer', [
        "ngSanitize",
        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
        "com.2fdevs.videogular.plugins.overlayplay",
        "com.2fdevs.videogular.plugins.buffering",
        "chromecast"
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

    module.controller('videoPlayerCtrl', function ($scope, $sce, $chromecast, $timeout) {

        $scope.$API = null;

        $scope.getUrl = function (url) {
            return $sce.trustAsResourceUrl(url);
        };

        $scope.setSrc = function () {
            var chromecastSrc = $scope.src;
            $scope.srcData = [{src: $scope.getUrl($scope.src), type: $scope.mimeType}];
            if ($scope.mimeType != 'video/mp4') {
                chromecastSrc = '/.nekumo/encode/' + chromecastSrc;
            }
            $chromecast.setSrc('http://192.168.88.11:7080/' + chromecastSrc);
        };

        $scope.onPlayerReady = function ($API) {
            $scope.$API = $API;
        };

        $scope.$watch('src', function () {
            if (!$scope.src) {
                return
            }
            if ($scope.$API) {
                $scope.$API.stop();
                $timeout($scope.$API.play.bind($scope.$API), 200);
            }
            $scope.setSrc();
        });
    });
});