/**
 * Created by nekmo on 22/01/17.
 */

var PLAYER_URL = (debug ? 'shared/%1$sPlayer/%1$sPlayer': 'dist/%1$sPlayer');

Promise.all([
    require('angular'),
    require('ocombe/ocLazyLoad'),

    require('src/shared/preview/preview.css!css')
]).then(function () {
    var sprintf = require('sprintf-js').sprintf;

    // var module = angular.module('preview', ['videoPlayer', 'audioPlayer', 'chromecast']);
    var module = angular.module('preview', ['nekumo']);
    // Supported players
    var playerMimetypes = {
        'video': 'video',
        'audio': 'audio',
        'image': 'image'
    };
    // Players that require loading
    var externalPlayers = {
        'video': 'video',
        'audio': 'audio'
    };

    function getPlayer(entry) {
        return playerMimetypes[entry.mimetype] || playerMimetypes[entry.mimetype.split('/')[0]] || null;
    }

    module.factory('$previewGallery', function ($templateRequest, $document, $compile, $rootScope, lazySystem) {
        function PreviewOptions(entry, entries) {
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
            var player = getPlayer(entry);
            var externalPlayer = (player ? externalPlayers[player] : null);

            this.setScope = function () {
                scope = $rootScope.$new();
                scope = angular.extend(scope, {
                    entry: entry,
                    player: player,
                    close: self.close,
                    options: self
                });
            };
            this.setScope();


            this.closeHandler = function () {
            };

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

            this.loadPlayer = function () {
                // return lazySystem.load(sprintf('./.nekumo/static/src/shared/%1$sPlayer/%1$sPlayer', player),
                // player + 'Player');
                return lazySystem.load(
                    sprintf(PLAYER_URL, externalPlayer),
                    externalPlayer + 'Player'
                );
            };

            this.start = function () {

                self.setBackdrop(scope);

                $templateRequest("/.nekumo/static/src/shared/preview/preview.html").then(function (html) {
                    // $chromecast.setSrc(data.src);
                    // $chromecast.setSrc(data.path);

                    var body = $document.find('body').eq(0);
                    var preview = angular.element(html);

                    function compile(){
                        $compile(preview)(scope);
                        body.append(preview);
                        self.preview = preview;
                    }
                    if(externalPlayer){
                        self.loadPlayer().then(function () {
                            // Sólo esperar al reproductor si lo hay
                            compile();
                        });
                    } else {
                        compile();
                    }
                });
            };

            this.start();
        }

        return function (entry, entries) {
            return new PreviewOptions(entry, entries);
        }
    });

    module.controller('previewGalleryCtrl', function ($scope, $document, $compile) {

        // TODO: no se está aplicando el cambio del entry al reproducitor

        $scope.$on('chromecastActivated', function () {
            $scope.close();
        })
    });
});