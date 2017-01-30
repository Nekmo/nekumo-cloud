

var module = angular.module('galleryApp', ['preview', 'chromecast']);

module.directive('gallery', function () {
    return {
        scope: {
            selectedSrc: '='
        },
        templateUrl: '/.nekumo/static/src/components/gallery/gallery.html'
    }
});

module.controller('galleryCtrl', function ($scope, $previewGallery, $chromecastPlayer) {

    $previewGallery({
        player: 'video',
        src: $scope.selectedSrc,
        mimeType: 'video/mp4'
    });
});
