/**
 * Created by nekmo on 22/01/17.
 */
var module = angular.module('preview', ['videoPlayer']);


module.factory('$previewGallery', function ($templateRequest, $document, $compile, $rootScope, $chromecast) {
    return function(data){
        // var body = $document.find('body').eq(0);
        // var backdrop = angular.element('<div id="backdrop"></div>');
        // $compile(backdrop)({});
        // body.append(backdrop);

        $templateRequest("/.nekumo/static/src/shared/preview/preview.html").then(function(html){

            $chromecast.setSrc(data.src);

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
