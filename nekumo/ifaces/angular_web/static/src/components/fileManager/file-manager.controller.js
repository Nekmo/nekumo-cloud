Promise.all([
    require('angular'),
    require("angular-animate"),
    require("angular-aria"),
    require("angular-material"),
    require('shared/preview/preview'),
    require('shared/utils/utils'),
    require('components/fileManager/options/options'),
    require('shared/theme/theme'),
    require('shared/fileManagerApi/fileManagerApi'),
    require('ccampbell/mousetrap'),
    require('chieffancypants/angular-hotkeys/src/hotkeys')
]).then(function () {
    var module = angular.module('app.file-manager', ['ngMaterial', 'fileManagerApi', 'utils', 'fmOptions', 'app.core',
                                                     'cfp.hotkeys', 'preview']);

    var _ = require('lodash');

    module.config(function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('');
    });


    module.directive('reverseIcon', function(){
        return {
            template: '<span class="mdi" ng-class="{\'mdi-arrow-up\': reverse, \'mdi-arrow-down\':' +
            ' !reverse}"></span>'
        };
    });


    module.controller('FileManagerController', function($rootScope, $scope, $mdSidenav, $location, API, Entry, hotkeys,
                                                        $q, $previewGallery) {

        $scope.scope = $scope;
        $scope.fmTemplates = {
            main_sidenav: require('src/components/fileManager/sidenavs/main/main-sidenav.html!ng-template'),
            grid_view: require('src/components/fileManager/views/grid/grid-view.html!ng-template'),
            list_view: require('src/components/fileManager/views/list/list-view.html!ng-template'),
            details_sidenav: require('src/components/fileManager/sidenavs/details/details-sidenav.html!ng-template')
        };

        // Data
        $scope.root = '/';  // Iface root
        $scope.breadcrumb = [];
        $scope.sortColumn = 'name';
        $scope.reverse = false;

        $scope.accounts = {
            'creapond'    : 'johndoe@creapond.com',
            'withinpixels': 'johndoe@withinpixels.com'
        };
        $scope.selectedAccount = 'creapond';

        $scope.currentView = 'list'; // default view
        // $scope.currentView = 'grid';
        $scope.showDetails = true;  // Details panel

        $scope.isLoaded = false;
        $scope.entries = [];  // All entries loaded
        $scope.entriesSelected = null; // Selected entries
        $scope.selected = null;  // Deprecated
        $scope.ctrlPulsed = false;  // Select items with ctrl
        $scope.shiftPulsed = false;  // Select items with shift
        $scope.lastSelected = null;  // Last selection for shift range
        $scope.previewOptions = null;

        $scope.lastDirectory = null;  // For unsubscribe
        $scope.currentDirectory = null;
        $scope.currentDirectoryData = null;

        $scope.sortBy = function(id) {
            $scope.reverse = ($scope.sortColumn === id) ? !$scope.reverse : false;
            $scope.sortColumn = id;
        };

        $scope.navigateTo = function(path) {
            if(!_.startsWith(path, '/')){
                path = $scope.currentDirectory + path;
            }
            $location.path(path);
        };

        // Pulsación en uno de los elementos. Es necesario controlar si se está
        // pulsando ctrl/shift al mismo tiempo
        $scope.select = function(item, clean, ev) {
            clean = ($scope.ctrlPulsed || $scope.shiftPulsed ? false : clean);
            function select(item, force_true){
                item.selected = !item.selected || force_true;
                if(item.selected){
                    $scope.entriesSelected.push(item);
                } else {
                    _.pull($scope.entriesSelected, item);
                }
                $scope.selected = item;
            }
            if(ev){
                ev.stopPropagation();
            }
            if(clean){
                // Pulsed without shift/ctrl
                $scope.cleanSelected();
            }
            if($scope.shiftPulsed){
                var range = [$scope.indexOfEntry($scope.lastSelected), $scope.indexOfEntry(item)].sort();
                angular.forEach(_.range(range[0], range[1]+1), function (i) {
                    select($scope.entries[i], true);
                });
            } else {
                select(item);
            }
            $scope.lastSelected = item;

        };

        $scope.getItemByPath = function (path) {
            return _.find($scope.entries, {path: path});
        };

        $scope.indexOfEntry = function (item) {
            return $scope.entries.indexOf(item);
        };

        $scope.toggleDetails = function(item) {
            $scope.selected = item;
            $scope.toggleSidenav('details-sidenav');
        };

        $scope.toggleSidenav = function(sidenavId){
            $mdSidenav(sidenavId).toggle();
        };

        $scope.toggleView = function(){
            $scope.currentView = $scope.currentView === 'list' ? 'grid' : 'list';
        };

        $scope.cleanSelected = function () {
            angular.forEach($scope.entriesSelected, function (entry) {
                entry.selected = false;
            });
            $scope.selected = null;
            $scope.entriesSelected = [];
        };

        $scope.totalSize = function (entries) {
            // Tamaño total para el sidevar
            entries = (entries === undefined ? $scope.entriesSelected : entries);
            return _.sumBy(entries, 'size');
        };

        function getCurrentDirectoryData () {
            var deferred = $q.defer();
            API.details($scope.currentDirectory).then(function (data) {
                $scope.currentDirectoryData = data;
                deferred.resolve(data);
            });
            return deferred.promise
        }

        function setEntries(path) {
            $scope.isLoaded = false;
            $scope.entries = [];
            var deferred = $q.defer();
            if($scope.lastDirectory){
                API.unwatch($scope.lastDirectory);
            }
            API.list(path).then(function (data) {
                $scope.entries = data;
                $scope.isLoaded = true;
                getCurrentDirectoryData().then(function () {
                    $scope.cleanSelected();
                    API.watch(path);
                });
                deferred.resolve();
            });
            return deferred.promise;
        }

        function getBreadcrumb(path) {
            // Habrá que tener en cuenta que el root puede ser distinto
            path = _.trim(path, '/');
            var breadcrumb =  _.filter(path.split('/'), function (x) { return x });
            var breadcrumbItems = [];
            angular.forEach(breadcrumb, function (value, i) {
                breadcrumbItems.push(Entry({
                    path: $scope.root + _.slice(breadcrumb, 0, i+1).join('/') + '/'
                }))
            });
            return breadcrumbItems
        }

        $rootScope.$on('$locationChangeSuccess', function () {
            var path = $location.path() || '/';
            var directory = path.slice(0, _.lastIndexOf(path, '/') + 1);
            if($scope.previewOptions) {
                $scope.previewOptions.close();
            }
            if(path == directory && directory == $scope.currentDirectory){
                // Si es el directorio actual, y está ya cargado, no hacer nada.
                return
            }
            var directoryLoad = null;
            if($scope.currentDirectory != directory){
                $scope.currentDirectory = directory;
                directoryLoad = setEntries(directory);
                $scope.breadcrumb = getBreadcrumb(directory);
                $scope.lastDirectory = directory;
            }

            function preview() {
                if(!_.endsWith(path, '/')){
                    // Es un archivo. Previsualizar
                    $location.search('preview');

                    $scope.previewOptions = $previewGallery($scope.getItemByPath(path), $scope.entries);
                    $scope.previewOptions.closeHandler = function () {
                        // Cuando se cierre, volver al listado.
                        $scope.navigateTo(directory);
                        $scope.previewOptions = null;
                    }
                }
            }

            if(directoryLoad){
                directoryLoad.then(function () {
                    preview();
                })
            } else {
                preview();
            }
        });

        hotkeys.add({
            combo: 'ctrl',
            description: 'Select items off',
            action: 'keyup',
            callback: function() {
                $scope.ctrlPulsed = false;
            }
        });

        hotkeys.add({
            combo: 'ctrl',
            description: 'Select items on',
            action: 'keydown',
            callback: function() {
                $scope.ctrlPulsed = true;
            }
        });

        hotkeys.add({
            combo: 'shift',
            description: 'Select items off',
            action: 'keyup',
            callback: function() {
                $scope.shiftPulsed = false;
            }
        });

        hotkeys.add({
            combo: 'shift',
            description: 'Select items on',
            action: 'keydown',
            callback: function() {
                $scope.shiftPulsed = true;
            }
        });

        API.updateListener('create', function (ev) {
            $scope.entries.push(ev.entry);
        });

        API.updateListener('delete', function (ev) {
            // TODO:
            var entry = $scope.getItemByPath(ev.entry.path);
            _.pull($scope.entries, entry);
        });

    });

    module.controller('DetailsSidenavCtrl', function ($scope) {
        $scope.$watch('entriesSelected', function () {
            if($scope.entriesSelected == null){
                return
            }
            $scope.selected = (
                ($scope.entriesSelected).length > 1 ? null : $scope.entriesSelected[0] || $scope.currentDirectoryData);
        }, true);
    });
});
