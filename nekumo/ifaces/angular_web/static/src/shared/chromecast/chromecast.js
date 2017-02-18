Promise.all([
    require('angular'),
    require('angular-material'),
    require('balliegojr/angular-event-dispatcher/build/event-dispatcher.js'),
    require('erykpiast/angular-duration-format')
]).then(function () {
    // Copyright 2016 Google Inc. All Rights Reserved.
    //
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    //
    // http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.


    /*
     var testEl = document.createElement( "video" ),
     mpeg4, h264, ogg, webm;
     if ( testEl.canPlayType ) {
     // Check for MPEG-4 support
     mpeg4 = "" !== testEl.canPlayType( 'video/mp4; codecs="mp4v.20.8"' );

     // Check for h264 support
     h264 = "" !== ( testEl.canPlayType( 'video/mp4; codecs="avc1.42E01E"' )
     || testEl.canPlayType( 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' ) );

     // Check for Ogg support
     ogg = "" !== testEl.canPlayType( 'video/ogg; codecs="theora"' );

     // Check for Webm support
     webm = "" !== testEl.canPlayType( 'video/webm; codecs="vp8, vorbis"' );
     }

     */

    /**
     * Media source root URL
     * @const
     */
    var emptyFn = function () {
    };

    function getVolumeLevelName(volumeLevel) {
        if (volumeLevel > 0) volumeLevelName = 'low';
        if (volumeLevel > 40) volumeLevelName = 'medium';
        if (volumeLevel > 70) volumeLevelName = 'high';
        if (!volumeLevel) volumeLevelName = 'off';
        return volumeLevelName;
    }

    var PLAYER_STATE = {
        IDLE: 'IDLE',
        LOADING: 'LOADING',
        LOADED: 'LOADED',
        PLAYING: 'PLAYING',
        PAUSED: 'PAUSED',
        STOPPED: 'STOPPED',
        ERROR: 'ERROR'
    };

    var Chromecast = function (chromecastOptions) {
        var defaultChromecastOptions = {
            force: false,
            callback: null
        };

        this.src = null;
        this.chromecastOptions = angular.extend(defaultChromecastOptions, chromecastOptions);
        this.castInstance = null;

        this.isInitialized = false;

        this._el = document.createElement('div');

        this.dispatch = this._el.dispatchEvent;
        // this.listen = this._el.addEventListener;
        this.listen = function (ev, fn) {
            // https://developers.google.com/cast/docs/reference/chrome/index-all
            // cast.framework.RemotePlayerEventType
            this._el.addEventListener(ev, fn);
        };
    };

    Chromecast.prototype.initializeCastPlayer = function () {
        // Inicializar Chromecast y eventos

        var options = {};

        // Set the receiver application ID to your own (created in the
        // Google Cast Developer Console), or optionally
        // use the chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
        // options.receiverApplicationId = '4F8B3483';
        options.receiverApplicationId = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;

        // Auto join policy can be one of the following three:
        // ORIGIN_SCOPED - Auto connect from same appId and page origin
        // TAB_AND_ORIGIN_SCOPED - Auto connect from same appId, page origin, and tab
        // PAGE_SCOPED - No auto connect
        options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;

        this.castInstance = cast.framework.CastContext.getInstance();
        this.castInstance.setOptions(options);

        this.remotePlayer = new cast.framework.RemotePlayer();
        this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);

        this.remotePlayerController.addEventListener(
            cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
            this.switchPlayer.bind(this)
        );
        this.enableListeners();
    };

    Chromecast.prototype.enableListeners = function () {
        if (!this.chromecastOptions.callback) {
            return
        }
        this.remotePlayerController.addEventListener(
            cast.framework.RemotePlayerEventType.ANY_CHANGE,
            this.chromecastOptions.callback
        );
    };

    Chromecast.prototype.switchPlayer = function () {
        // Se inicia/cierra Chromecast
        this.playerState = PLAYER_STATE.IDLE;
        if (cast && cast.framework) {
            // Está el Chromecast disponible
            if (this.remotePlayer.isConnected) {
                this.isInitialized = true;
                // this.setupRemotePlayer();
                this.load();
            } else {
                this.isInitialized = false;
            }
        }
    };

    Chromecast.prototype.getCurrentSession = function () {
        if (this.castInstance) {
            return this.castInstance.getCurrentSession();
        }
    };

    Chromecast.prototype.getMediaSession = function () {
        var currentSession = this.getCurrentSession();
        if (currentSession) {
            return currentSession.getMediaSession();
        }
    };

    Chromecast.prototype.getPlayerState = function () {
        return (this.getMediaSession() || {}).playerState || "";
    };

    Chromecast.prototype.load = function () {
        var currentSession = this.getCurrentSession();

        if (!this.chromecastOptions.force && (!currentSession || this.getPlayerState())) {
            return
        }

        var defaultOptions = {
            mimeType: 'video/mp4',
            title: null,
            thumbs: null
        };
        var options = angular.extend(defaultOptions, this.options);
        var mediaInfo = new chrome.cast.media.MediaInfo(this.src, options.mimeType);
        mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
        mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
        if (options.title) {
            mediaInfo.metadata.title = options.title;
        }
        if (options.thumbs) {
            mediaInfo.metadata.images = options.thumbs;
        }

        var request = new chrome.cast.media.LoadRequest(mediaInfo);
        currentSession.loadMedia(request);

        // console.log('Loading...' + this.mediaContents[mediaIndex]['title']);
        // // TODO: chromecast
        // var mediaInfo = new chrome.cast.media.MediaInfo(
        //     this.mediaContents[mediaIndex]['sources'][0], 'video/mp4');

        // mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
        // mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
        // mediaInfo.metadata.title = this.mediaContents[mediaIndex]['title'];
        // mediaInfo.metadata.images = [
        //     {'url': MEDIA_SOURCE_ROOT + this.mediaContents[mediaIndex]['thumb']}];
        //
        // var request = new chrome.cast.media.LoadRequest(mediaInfo);

        // castSession.loadMedia(request).then(
        //     this.playerHandler.loaded.bind(this.playerHandler),
        //     function (errorCode) {
        //         this.playerState = PLAYER_STATE.ERROR;
        //         console.log('Remote media load error: ' +
        //             CastPlayer.getErrorMessage(errorCode));
        //     }.bind(this)
        // );
    };

    // Chromecast.prototype.setupRemotePlayer = function () {
    // };

    Chromecast.prototype.setSrc = function (src, options) {
        this.src = src;
        this.options = options;
        this.load();
    };

    Chromecast.prototype.start = function () {
        window['__onGCastApiAvailable'] = function (isAvailable) {
            if (isAvailable) {
                // La API está disponible
                this.initializeCastPlayer();
            }
        }.bind(this);
    };

    Chromecast.prototype.getDuration = function () {
        return this.remotePlayer.duration;
    };

    Chromecast.prototype.seekTo = function (time) {
        if (!this.remotePlayer) {
            return
        }
        this.remotePlayer.currentTime = time;
        this.remotePlayerController.seek();
    };

    Chromecast.prototype.setVolumeLevel = function (volumeLevel) {
        this.remotePlayer.volumeLevel = volumeLevel;
        this.remotePlayerController.setVolumeLevel();
    };

    Chromecast.prototype.play = function () {
        return (this.getMediaSession() || {play: emptyFn}).play();
    };

    Chromecast.prototype.pause = function () {
        return (this.getMediaSession() || {pause: emptyFn}).pause();
    };

    Chromecast.prototype.togglePause = function () {
        if (this.getPlayerState() == PLAYER_STATE.PAUSED) {
            this.play();
        } else {
            this.pause();
        }
    };

    var module = angular.module('chromecast', ['eventDispatcherModule', 'ngMaterial', 'angular-duration-format']);

    module.factory('$chromecast', function (eventDispatcher) {
        // TODO: el módulo de eventDispatcher es nuevo. Comprobarlo.
        var events = eventDispatcher;
        // events.logger.logLevel = 'error';

        var castPlayer = new Chromecast({
            callback: function (ev) {
                events.trigger(ev.field, ev);
                events.trigger('anyChange', ev);
            }
        });
        castPlayer.start();
        castPlayer.events = events;

        events.on('anyChange', function (ev) {
            console.debug(ev);
        });

        return castPlayer;
    });

    // module.factory('$chromecastPlayer', function () {
    //     return {}
    // })

    module.factory('$chromecastPlayer', function ($document, $templateRequest, $compile, $rootScope, $chromecast) {
        return function () {
            $templateRequest("/.nekumo/static/src/shared/chromecast/player.html").then(function (html) {
                var body = $document.find('body').eq(0);

                var preview = angular.element(html);
                var scope = $rootScope.$new();
                scope = angular.extend(scope, {
                    $chromecast: $chromecast, playerState: 'UNKNOWN', duration: null, currentTime: 0,
                    volumeSlider: false, volumeLevel: 0, volumeLevelName: 'high'
                });

                scope.playerState = null;

                scope.toggleVolumeSlider = function () {
                    scope.volumeSlider = !scope.volumeSlider;
                };

                scope.setVolumeLevel = function (volumeLevel) {
                    scope.volumeLevelName = getVolumeLevelName(volumeLevel);
                    $chromecast.setVolumeLevel(volumeLevel / 100);
                };

                scope.undo = function () {
                    $chromecast.seekTo(Math.max(scope.currentTime - 30, 0));
                };

                $compile(preview)(scope);
                body.append(preview);

                c = $chromecast;

                $chromecast.events.on('playerState', function (ev) {
                    scope.$apply(function () {
                        if (ev.value && scope.playerState === null) {
                            // Mandar evento de activado Chromecast ahora.
                            // esto debe cerrar preview
                            $rootScope.$broadcast('chromecastActivated');
                        }
                        scope.playerState = ev.value;
                    });
                });

                $chromecast.events.on('duration', function (ev) {
                    scope.$apply(function () {
                        scope.duration = parseInt(ev.value);
                    });
                });

                $chromecast.events.on('currentTime', function (ev) {
                    scope.$apply(function () {
                        scope.currentTime = parseInt(ev.value);
                    });
                });

                $chromecast.events.on('volumeLevel', function (ev) {
                    console.log(ev);
                    scope.$apply(function () {
                        scope.volumeLevel = ev.value * 100;
                        scope.volumeLevelName = getVolumeLevelName(scope.volumeLevel);
                    });
                });
            });
        }
    });

    module.directive('includeReplace', function () {
        return {
            require: 'ngInclude',
            link: function (scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    });
});