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
    function PreviewOptions(entry, entries){
        self = this;

        this.preview = null;
        this.backdrop = null;

        this.close = function () {
            self.preview.remove();
            self.backdrop.remove();
            self.closeHandler();
        };

        // TODO: no se está aplicando el cambio del tipo de entry. No se cambia de player
        // cuando se necesita
        var scope;
        this.setScope = function () {
            scope = $rootScope.$new();
            scope = angular.extend(scope, {
                entry: entry,
                player: getPlayer(entry),
                close: self.close,
                options: self
            });
        };
        this.setScope();


        this.closeHandler = function () {};

        this.setBackdrop = function (scope) {
            var body = $document.find('body').eq(0);
            self.backdrop = angular.element('<div id="backdrop" ng-click="close();"></div>');
            $compile(self.backdrop)(scope);
            body.append(self.backdrop);
        };

        this.indexOfEntry = function () {
            return entries.indexOf(entry);
        };


        this.prevEntry = function () {
            var i = self.indexOfEntry() - 1;
            i = (i >= 0 ? i : entries.length - 1);
            scope.entry = entries[i];
            entry = scope.entry;
        };

        this.nextEntry = function () {
            var i = self.indexOfEntry() + 1;
            scope.entry = entries[i % (entries.length)];
            entry = scope.entry;
        };

        this.start = function () {

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

    return function(entry, entries){
        return new PreviewOptions(entry, entries);
    }
});

module.controller('previewGalleryCtrl', function ($scope, $document, $compile) {

    // TODO: no se está aplicando el cambio del entry al reproducitor

    $scope.$on('chromecastActivated', function () {
        $scope.close();
    })
});
