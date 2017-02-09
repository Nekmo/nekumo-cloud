/**
 * Created by nekmo on 22/01/17.
 */
var module = angular.module('preview', ['videoPlayer']);
var playerMimetypes = {
    'video': 'video'
};

function getPlayer(entry) {
    return playerMimetypes[entry.mimetype] || playerMimetypes[entry.mimetype.split('/')[0]]
}


module.factory('$previewGallery', function ($templateRequest, $document, $compile, $rootScope, $chromecast) {
    return function(entry){

        $templateRequest("/.nekumo/static/src/shared/preview/preview.html").then(function(html){

            // $chromecast.setSrc(data.src);
            // $chromecast.setSrc(data.path);

            var body = $document.find('body').eq(0);

            var preview = angular.element(html);
            var scope = $rootScope.$new();
            scope = angular.extend(scope, {
                entry: entry,
                player: getPlayer(entry),
                preview: preview
            });

            $compile(preview)(scope);
            body.append(preview);
        });
    }
});

module.controller('previewGalleryCtrl', function ($scope, $document, $compile) {
    $scope.setBackdrop = function () {
        var body = $document.find('body').eq(0);
        $scope.backdrop = angular.element('<div id="backdrop" ng-click="close();"></div>');
        $compile($scope.backdrop)($scope);
        body.append($scope.backdrop);
    };

    $scope.close = function () {
        $scope.backdrop.remove();
        $scope.preview.remove();
    };

    $scope.setBackdrop();

    $scope.$on('chromecastActivated', function () {
        $scope.close();
    })
});
