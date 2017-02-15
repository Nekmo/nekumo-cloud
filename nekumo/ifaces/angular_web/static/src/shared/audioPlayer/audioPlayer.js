/**
 * Created by nekmo on 13/02/17.
 */

var module = angular.module('audioPlayer', [
    'ngAudio'
]);

module.directive('audioPlayer', function () {
    return {
        scope: {
            src: '=',
            mimeType: '='
        },
        templateUrl: '/.nekumo/static/src/shared/audioPlayer/audioPlayer.html'
    }
});

module.controller('audioPlayerCtrl', function ($scope, ngAudio) {
    $scope.sound = ngAudio.load($scope.src);
    $scope.sound.play();
});