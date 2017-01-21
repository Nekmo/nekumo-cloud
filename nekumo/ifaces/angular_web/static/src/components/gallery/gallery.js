

var module = angular.module('galleryApp', ['videoPlayer']);

module.directive('gallery', function () {
    return {
        scope: {

        },
        templateUrl: '/static/src/components/gallery/gallery.html'
    }
});


module.factory('$previewGallery', function ($templateRequest, $document, $compile, $rootScope) {
    return function(data){
        // var body = $document.find('body').eq(0);
        //
        // var backdrop = angular.element('<div id="backdrop"></div>');
        // $compile(backdrop)({});
        // body.append(backdrop);

        $templateRequest("/static/src/components/gallery/preview.html").then(function(html){
            var body = $document.find('body').eq(0);

            var preview = angular.element(html);
            var scope = $rootScope.$new();
            scope = angular.extend(scope, data);

            $compile(preview)(scope);
            body.append(preview);
        });
    }
});

module.controller('previewGalleryCtrl', function ($scope) {
});

module.controller('galleryCtrl', function ($scope, $previewGallery) {
    $previewGallery({
        player: 'video',
        src: '/Hora%20de%20Aventuras/6x01%20Wake%20up.mp4',
        mimeType: 'video/mp4'
    });
});