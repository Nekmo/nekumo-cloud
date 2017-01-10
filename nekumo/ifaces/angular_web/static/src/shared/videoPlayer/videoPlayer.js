/**
 * Created by nekmo on 10/01/17.
 */
var module = angular.module('videoPlayer', [
    "ngSanitize",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay"
]);

module.directive('videoPlayer', function () {
    return {
        scope: {
            src: '=',
            mimeType: '='
        },
        templateUrl: '/static/src/shared/videoPlayer/videoPlayer.html'
    }
});

module.controller('videoPlayerCtrl', function ($scope, $sce) {
    $scope.getUrl = function (url) {
        return $sce.trustAsResourceUrl(url);
    };

    $scope.srcData = [{src: $scope.getUrl($scope.src), type: $scope.mimeType}];

});