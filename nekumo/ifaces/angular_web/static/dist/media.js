System.registerDynamic("github:balliegojr/angular-event-dispatcher@0.0.3/build/event-dispatcher.js",[],!1,function(e,t,n){var r=System.get("@@global-helpers").prepareGlobal(n.id,null,null);return function(e){!function(){"use strict";function e(e,t){this._eventSubscriptions=e.newRegistry(),this._strictMode=t}function t(e,t,n){return function(){e.off(t,n)}}e.prototype.register=function(e){var t=this._eventSubscriptions.getValue(e);"undefined"==typeof t&&(t=[],this._eventSubscriptions.register(e,t))},e.prototype._subscribe=function(e,t){var n=this._eventSubscriptions.getValue(e);if(console.error(this._strictMode),"undefined"==typeof n){if(this._strictMode===!0)throw"EventDispatcher: "+e+" not registered";this.register(e),n=this._eventSubscriptions.getValue(e)}n.push(t)},e.prototype._unsubscribe=function(e,t){var n,r=this._eventSubscriptions.getValue(e);if("undefined"==typeof r){if(!this._strictMode)return;throw"EventDispatcher: "+e+" not registered"}for(n=r.length-1;n>=0;n--)r[n]===t&&r.splice(n,1)},e.prototype.on=function(e,n){if(e instanceof Array)for(var r=0;r<e.length;r++)this._subscribe(e[r],n);else this._subscribe(e,n);return new t(this,e,n)},e.prototype.off=function(e,t){if(e instanceof Array)for(var n=0;n<e.length;n++)this._unsubscribe(e[n],t);else this._unsubscribe(e,t)},e.prototype.trigger=function(e,t,n){var r,a=this._eventSubscriptions.getValue(e);if("undefined"==typeof a){if(!this._strictMode)return;throw"EventDispatcher: "+e+" not registered"}for(t=t instanceof Array?t:[t],n=n||this.caller,r=a.length-1;r>=0;r--)try{a[r].apply(n,t)}catch(e){console.error(e)}},angular.module("eventDispatcherModule",["RegistryModule"]).provider("eventDispatcher",[function(){var t=!1;this.strictModeOn=function(){t=!0},this.$get=["RegistryFactory",function(n){return new e(n,t)}]}])}(),function(){"use strict";function e(e){var t=Object.create(null),n=e;this.register=function(e,n){t[e]=n},this.getValue=function(e){return Object.prototype.hasOwnProperty.call(t,e)?t[e]:n},this.getValues=function(){var e=[];for(var n in t)e.push(t[n]);return e}}angular.module("RegistryModule",[]).factory("RegistryFactory",[function(){return{newRegistry:function(t){return new e(t)}}}])}()}(this),r()}),System.registerDynamic("github:erykpiast/angular-duration-format@1.0.1/dist/angular-duration-format.js",[],!1,function(e,t,n){var r=System.get("@@global-helpers").prepareGlobal(n.id,null,null);return function(e){angular.module("angular-duration-format.filter",[]).filter("duration",function(){function e(e){for(var t=[],n=e?e.toString():"";n;){var a=r.exec(n);a?(t=t.concat(a.slice(1)),n=t.pop()):(t.push(n),n=null)}return t}function t(e,t){var r="",i={};return t.filter(function(e){return a.hasOwnProperty(e)}).map(function(e){var t=a[e];return t.hasOwnProperty("pad")?t.value:e}).filter(function(e,t,n){return n.indexOf(e)===t}).map(function(e){return angular.extend({name:e},a[e])}).sort(function(e,t){return t.value-e.value}).forEach(function(t){var n=i[t.name]=Math.floor(e/t.value);e-=n*t.value}),t.forEach(function(e){var t=a[e];if(t){var s=i[t.value];r+=t.hasOwnProperty("pad")?n(s,Math.max(t.pad,s.toString().length)):i[e]}else r+=e.replace(/(^'|'$)/g,"").replace(/''/g,"'")}),r}function n(e,t){return(new Array(t+1).join("0")+e).slice(-t)}var r=/((?:[^ydhms']+)|(?:'(?:[^']|'')*')|(?:y+|d+|h+|m+|s+))(.*)/,a={y:{value:31536e6},yy:{value:"y",pad:2},d:{value:864e5},dd:{value:"d",pad:2},h:{value:36e5},hh:{value:"h",pad:2},m:{value:6e4},mm:{value:"m",pad:2},s:{value:1e3},ss:{value:"s",pad:2},sss:{value:1},ssss:{value:"sss",pad:4}};return function(n,r){var a=parseFloat(n,10),i=e(r);return isNaN(a)||0===i.length?n:t(a,i)}}),angular.module("angular-duration-format",["angular-duration-format.filter"])}(this),r()}),System.registerDynamic("github:erykpiast/angular-duration-format@1.0.1.js",["github:erykpiast/angular-duration-format@1.0.1/dist/angular-duration-format.js"],!0,function(e,t,n){this||self;n.exports=e("github:erykpiast/angular-duration-format@1.0.1/dist/angular-duration-format.js")}),System.registerDynamic("src/shared/chromecast/chromecast.css!github:systemjs/plugin-css@0.1.32.js",[],!1,function(e,t,n){var r=System.get("@@global-helpers").prepareGlobal(n.id,null,null);return function(e){}(this),r()}),System.registerDynamic("src/shared/chromecast/player.html!github:jamespamplin/plugin-ng-template@0.1.1.js",["angular"],!0,function(e,t,n){var r=(this||self,"src/shared/chromecast/player.html");e("angular").module("ng").run(["$templateCache",function(e){e.put(r,'<div id="player" class="md-whiteframe-3dp" flex-xs="100" flex-sm="100" flex-md="60" flex-lg="50" flex-xl="40"\n     ng-if="playerState !== null">\n    <div layout="row" hide-gt-sm>\n        <ng-include src="\'/.nekumo/static/src/shared/chromecast/playerSlider.html\'" include-replace></ng-include>\n    </div>\n    <div layout="row" class="controllers">\n        <div>\n            <md-button class="md-raised md-primary play-pause" ng-click="$chromecast.togglePause();">\n                <md-icon md-font-set="mdi" md-font-icon="mdi-play" ng-if="playerState == \'PAUSED\'"></md-icon>\n                <md-icon md-font-set="mdi" md-font-icon="mdi-pause" ng-if="playerState != \'PAUSED\'"></md-icon>\n            </md-button>\n            <md-button ng-click="undo();" class="undo">\n                <md-icon md-font-set="mdi" md-font-icon="mdi-undo"></md-icon>\n            </md-button>\n            <span class="timing">{{ (currentTime * 1000)|duration:\'h:mm:ss\' }}</span>\n        </div>\n        <ng-include src="\'/.nekumo/static/src/shared/chromecast/playerSlider.html\'" include-replace></ng-include>\n        <div>\n            <span class="timing" hide-xs hide-sm>{{ (duration * 1000)|duration:\'h:mm:ss\' }}</span>\n            <div id="volume">\n                <md-button ng-class="{\'md-raised\': volumeSlider}" ng-click="toggleVolumeSlider();">\n                    <md-icon md-font-set="mdi" md-font-icon="mdi-volume-{{ volumeLevelName }}"></md-icon>\n                </md-button>\n                <div id="volume-slider" md-whiteframe="1" ng-if="volumeSlider">\n                    <md-slider ng-model="volumeLevel" min="0" max="100" aria-label="volume" md-discrete\n                               ng-change="setVolumeLevel(volumeLevel)"\n                               class="md-accent" md-vertical></md-slider>\n                </div>\n            </div>\n            <button class="cast md-button md-ink-ripple" is="google-cast-button"></button>\n        </div>\n    </div>\n</div>')}]),n.exports={templateUrl:r}}),System.registerDynamic("src/shared/chromecast/playerSlider.html!github:jamespamplin/plugin-ng-template@0.1.1.js",["angular"],!0,function(e,t,n){var r=(this||self,"src/shared/chromecast/playerSlider.html");e("angular").module("ng").run(["$templateCache",function(e){e.put(r,'<md-slider flex ng-model="currentTime"\n           min="1" max="{{ duration }}"\n           ng-change="$chromecast.seekTo(currentTime)"\n           aria-label="timer">\n</md-slider>\n')}]),n.exports={templateUrl:r}}),System.registerDynamic("src/shared/chromecast/chromecast.js",["angular","angular-material","balliegojr/angular-event-dispatcher/build/event-dispatcher.js","erykpiast/angular-duration-format","src/shared/chromecast/chromecast.css!css","src/shared/chromecast/player.html!ng-template","src/shared/chromecast/playerSlider.html!ng-template"],!0,function(e,t,n){this||self;Promise.all([e("angular"),e("angular-material"),e("balliegojr/angular-event-dispatcher/build/event-dispatcher.js"),e("erykpiast/angular-duration-format"),e("src/shared/chromecast/chromecast.css!css"),e("src/shared/chromecast/player.html!ng-template"),e("src/shared/chromecast/playerSlider.html!ng-template")]).then(function(){function t(e){return e>0&&(volumeLevelName="low"),e>40&&(volumeLevelName="medium"),e>70&&(volumeLevelName="high"),e||(volumeLevelName="off"),volumeLevelName}var n=function(){},r={IDLE:"IDLE",LOADING:"LOADING",LOADED:"LOADED",PLAYING:"PLAYING",PAUSED:"PAUSED",STOPPED:"STOPPED",ERROR:"ERROR"},a=function(e){var t={force:!1,callback:null};this.src=null,this.chromecastOptions=angular.extend(t,e),this.castInstance=null,this.isInitialized=!1,this._el=document.createElement("div"),this.dispatch=this._el.dispatchEvent,this.listen=function(e,t){this._el.addEventListener(e,t)}};a.prototype.initializeCastPlayer=function(){var e={};e.receiverApplicationId=chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,e.autoJoinPolicy=chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,this.castInstance=cast.framework.CastContext.getInstance(),this.castInstance.setOptions(e),this.remotePlayer=new cast.framework.RemotePlayer,this.remotePlayerController=new cast.framework.RemotePlayerController(this.remotePlayer),this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,this.switchPlayer.bind(this)),this.enableListeners()},a.prototype.enableListeners=function(){this.chromecastOptions.callback&&this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.ANY_CHANGE,this.chromecastOptions.callback)},a.prototype.switchPlayer=function(){this.playerState=r.IDLE,cast&&cast.framework&&(this.remotePlayer.isConnected?(this.isInitialized=!0,this.load()):this.isInitialized=!1)},a.prototype.getCurrentSession=function(){if(this.castInstance)return this.castInstance.getCurrentSession()},a.prototype.getMediaSession=function(){var e=this.getCurrentSession();if(e)return e.getMediaSession()},a.prototype.getPlayerState=function(){return(this.getMediaSession()||{}).playerState||""},a.prototype.load=function(){var e=this.getCurrentSession();if(this.chromecastOptions.force||e&&!this.getPlayerState()){var t={mimeType:"video/mp4",title:null,thumbs:null},n=angular.extend(t,this.options),r=new chrome.cast.media.MediaInfo(this.src,n.mimeType);r.metadata=new chrome.cast.media.GenericMediaMetadata,r.metadata.metadataType=chrome.cast.media.MetadataType.GENERIC,n.title&&(r.metadata.title=n.title),n.thumbs&&(r.metadata.images=n.thumbs);var a=new chrome.cast.media.LoadRequest(r);e.loadMedia(a)}},a.prototype.setSrc=function(e,t){this.src=e,this.options=t,this.load()},a.prototype.start=function(){window.__onGCastApiAvailable=function(e){e&&this.initializeCastPlayer()}.bind(this)},a.prototype.getDuration=function(){return this.remotePlayer.duration},a.prototype.seekTo=function(e){this.remotePlayer&&(this.remotePlayer.currentTime=e,this.remotePlayerController.seek())},a.prototype.setVolumeLevel=function(e){this.remotePlayer.volumeLevel=e,this.remotePlayerController.setVolumeLevel()},a.prototype.play=function(){return(this.getMediaSession()||{play:n}).play()},a.prototype.pause=function(){return(this.getMediaSession()||{pause:n}).pause()},a.prototype.togglePause=function(){this.getPlayerState()==r.PAUSED?this.play():this.pause()};var i=angular.module("chromecast",["eventDispatcherModule","ngMaterial","angular-duration-format"]);i.factory("$chromecast",["eventDispatcher",function(e){var t=e,n=new a({callback:function(e){t.trigger(e.field,e),t.trigger("anyChange",e)}});return n.start(),n.events=t,t.on("anyChange",function(e){console.debug(e)}),n}]),i.factory("$chromecastPlayer",["$document","$templateRequest","$compile","$rootScope","$chromecast",function(n,r,a,i,s){return function(){var o=e("src/shared/chromecast/player.html!ng-template").templateUrl;r(o).then(function(e){var r=n.find("body").eq(0),o=angular.element(e),l=i.$new();l=angular.extend(l,{$chromecast:s,playerState:"UNKNOWN",duration:null,currentTime:0,volumeSlider:!1,volumeLevel:0,volumeLevelName:"high"}),l.playerState=null,l.toggleVolumeSlider=function(){l.volumeSlider=!l.volumeSlider},l.setVolumeLevel=function(e){l.volumeLevelName=t(e),s.setVolumeLevel(e/100)},l.undo=function(){s.seekTo(Math.max(l.currentTime-30,0))},a(o)(l),r.append(o),c=s,s.events.on("playerState",function(e){l.$apply(function(){e.value&&null===l.playerState&&i.$broadcast("chromecastActivated"),l.playerState=e.value})}),s.events.on("duration",function(e){l.$apply(function(){l.duration=parseInt(e.value)})}),s.events.on("currentTime",function(e){l.$apply(function(){l.currentTime=parseInt(e.value)})}),s.events.on("volumeLevel",function(e){console.log(e),l.$apply(function(){l.volumeLevel=100*e.value,l.volumeLevelName=t(l.volumeLevel)})})})}}]),i.directive("includeReplace",function(){return{require:"ngInclude",link:function(e,t,n){t.replaceWith(t.children())}}})})}),System.registerDynamic("src/components/media/media.css!github:systemjs/plugin-css@0.1.32.js",[],!1,function(e,t,n){var r=System.get("@@global-helpers").prepareGlobal(n.id,null,null);return function(e){}(this),r()}),System.registerDynamic("src/components/media/no-results.html!github:jamespamplin/plugin-ng-template@0.1.1.js",["angular"],!0,function(e,t,n){var r=(this||self,"src/components/media/no-results.html");e("angular").module("ng").run(["$templateCache",function(e){e.put(r,'<div flex-xs flex="40" flex-offset="30" layout="column" id="directory-empty">\n    <md-card>\n        <div class="md-card-image">\n            <i class="mdi mdi-package-variant"></i>\n        </div>\n        <md-card-title>\n            <md-card-title-text>\n                <span class="md-headline">No results available</span>\n            </md-card-title-text>\n        </md-card-title>\n        <md-card-content>\n            <p>\n                There are no results for this category. Try another category. If you have configured this list,\n                it may not yet be indexed or may be misconfigured.\n            </p>\n        </md-card-content>\n        <!--\n        <md-card-actions layout="row" layout-align="end center">\n            <md-button class="md-icon-button" aria-label="Favorite">\n                <md-icon md-svg-icon="img/icons/favorite.svg"></md-icon>\n            </md-button>\n            <md-button class="md-icon-button" aria-label="Settings">\n                <md-icon md-svg-icon="img/icons/menu.svg"></md-icon>\n            </md-button>\n            <md-button class="md-icon-button" aria-label="Share">\n                <md-icon md-svg-icon="img/icons/share-arrow.svg"></md-icon>\n            </md-button>\n        </md-card-actions>\n        -->\n    </md-card>\n</div>\n')}]),n.exports={templateUrl:r}}),System.registerDynamic("src/components/media/grid.html!github:jamespamplin/plugin-ng-template@0.1.1.js",["angular"],!0,function(e,t,n){var r=(this||self,"src/components/media/grid.html");e("angular").module("ng").run(["$templateCache",function(e){e.put(r,'<!--\n<div ng-controller="gridCtrl" class="grid period-media layout-wrap layout-row" layout="row" layout-wrap="">\n    <grid-item entry="entry" ng-repeat="entry in entries"></grid-item>\n</div>\n-->\n<div ng-controller="gridCtrl" flex ng-cloak>\n    <div ng-if="entries.length">\n        <h2>{{ title }}</h2>\n        <md-grid-list\n                md-cols="1" md-cols-sm="2" md-cols-md="3" md-cols-lg="6" md-cols-xl="7"\n                md-row-height-gt-md="4:1" md-row-height="5:1"\n                md-gutter="8px" md-gutter-gt-sm="4px" >\n            <!-- <grid-item entry="entry" ng-repeat="entry in entries"></grid-item> -->\n            <md-grid-tile\n                    ng-click="preview(entry);"\n                    ng-repeat="entry in entries"\n                    class="media-entry background-{{ entry.colorClass }}"\n                    md-rowspan="{{ (entry.isDir ? 1 : 4) }}"\n                    md-colspan="1"\n                    style="background-image: url(\'/.nekumo/thumb/{{ entry.path }}\');" >\n                <md-icon md-svg-icon="{{tile.icon}}"></md-icon>\n                <h3 ng-if="entry.isDir">{{entry.name}}</h3>\n                <md-grid-tile-footer ng-if="!entry.isDir"><h3>{{entry.name}}</h3></md-grid-tile-footer>\n            </md-grid-tile>\n        </md-grid-list>\n    </div>\n    <div ng-if="!entries.length && isSelected">\n        <ng-include src="\'/.nekumo/static/src/components/media/no-results.html\'"></ng-include>\n    </div>\n</div>')}]),n.exports={templateUrl:r}}),System.registerDynamic("src/components/media/media.js",["angular","angular-animate","angular-aria","angular-material","sprintf-js","shared/nekumo/nekumo","shared/preview/preview","shared/chromecast/chromecast","shared/fileManagerApi/fileManagerApi","src/shared/theme/theme.css!css","src/components/media/media.css!css","lodash","src/components/fileManager/sidenavs/main/main-sidenav.html!ng-template","src/components/media/no-results.html!ng-template","src/components/media/grid.html!ng-template"],!0,function(e,t,n){this||self;Promise.all([e("angular"),e("angular-animate"),e("angular-aria"),e("angular-material"),e("sprintf-js"),e("shared/nekumo/nekumo"),e("shared/preview/preview"),e("shared/chromecast/chromecast"),e("shared/fileManagerApi/fileManagerApi"),e("src/shared/theme/theme.css!css"),e("src/components/media/media.css!css")]).then(function(){var t=e("lodash"),n=angular.module("mediaApp",["nekumo","preview","chromecast","fileManagerApi"]);n.directive("media",function(){return{scope:{selectedSrc:"="},templateUrl:"/.nekumo/static/src/components/media/media.html"}}),n.controller("mediaCtrl",["$rootScope","$scope","$previewGallery","$chromecastPlayer","$location","$filter","API",function(n,r,a,i,s,o,l){function c(e){r.isLoaded=!1,r.entries=[],r.videoEntries=[],r.audioEntries=[],r.imageEntries=[],r.otherEntries=[],l.list(e).then(function(e){r.isLoaded=!0,angular.forEach(e,function(e){var t=r[e.category+"Entries"];t=void 0!==t?t:r.otherEntries,t.push(e)}),r.otherEntries=o("orderBy")(r.otherEntries,["-isDir","name"])})}function m(e){e=t.trim(e,"/");var n=t.filter(e.split("/"),function(e){return e}),a=[];return angular.forEach(n,function(e,i){a.push(Entry({path:r.root+t.slice(n,0,i+1).join("/")+"/"}))}),a}i(),r.templates={main_sidenav:e("src/components/fileManager/sidenavs/main/main-sidenav.html!ng-template"),no_results:e("src/components/media/no-results.html!ng-template")},r.currentDirectory=null,r.category="all",n.$on("$locationChangeSuccess",function(){r.currentDirectory=s.path(),c(s.path()),r.breadcrumb=m(s.path())})}]),n.directive("grid",function(){return{scope:{entries:"=",title:"@",isSelected:"="},templateUrl:e("src/components/media/grid.html!ng-template").templateUrl}}),n.controller("gridCtrl",["$scope","$previewGallery",function(e,t){e.preview=function(n){t(n,e.entries)}}])})});