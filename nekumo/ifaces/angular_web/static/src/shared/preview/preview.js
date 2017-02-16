/**
 * Created by nekmo on 22/01/17.
 */
var module = angular.module('preview', ['videoPlayer', 'audioPlayer', 'chromecast']);
var playerMimetypes = {
    'video': 'video',
    'audio': 'audio',
    'image': 'image'
};

function getPlayer(entry) {
    return playerMimetypes[entry.mimetype] || playerMimetypes[entry.mimetype.split('/')[0]]
}


module.factory('$previewGallery', function ($templateRequest, $document, $compile, $rootScope, $chromecast) {
    function PreviewOptions(entry){
        self = this;

        this.preview = null;
        this.backdrop = null;

        this.close = function () {
            console.log('Close!');
            self.preview.remove();
            self.backdrop.remove();
            self.closeHandler();
        };

        this.closeHandler = function () {};

        this.setBackdrop = function (scope) {
            var body = $document.find('body').eq(0);
            self.backdrop = angular.element('<div id="backdrop" ng-click="close();"></div>');
            $compile(self.backdrop)(scope);
            body.append(self.backdrop);
        };

        this.start = function () {
            var scope = $rootScope.$new();
            scope = angular.extend(scope, {
                entry: entry,
                player: getPlayer(entry),
                close: self.close
            });

            self.setBackdrop(scope);

            $templateRequest("/.nekumo/static/src/shared/preview/preview.html").then(function(html){
                // $chromecast.setSrc(data.src);
                // $chromecast.setSrc(data.path);

                var body = $document.find('body').eq(0);
                var preview = angular.element(html);

                // Puedo usar justo para este punto ocLazy?
                $compile(preview)(scope);
                body.append(preview);

                self.preview = preview;
            });
        };

        this.start();
    }

    return function(entry){
        return new PreviewOptions(entry);
    }
});

module.controller('previewGalleryCtrl', function ($scope, $document, $compile) {

    // $scope.close = function () {
    //     $scope.backdrop.remove();
    //     $scope.preview.remove();
    // };

    $scope.$on('chromecastActivated', function () {
        $scope.close();
    })
});
