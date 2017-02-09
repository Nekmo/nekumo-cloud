
var module = angular.module('app.file-manager', ['ngMaterial', 'fileManagerApi', 'utils', 'fmOptions', 'app.core',
                                                 'cfp.hotkeys'
]);



    module.config(function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('');
    });

module.directive('reverseIcon', function(){
    return {
        template: '<span class="mdi" ng-class="{\'mdi-arrow-up\': reverse, \'mdi-arrow-down\':' +
        ' !reverse}"></span>'
    };
});

module.directive('countEntries', function(entry_entries) {

});

module.controller('FileManagerController', function($rootScope, $scope, $mdSidenav, $location, API, Entry, hotkeys) {
    var vm = this;

    $scope.scope = $scope;

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
    $scope.entriesSelected = []; // Selected entries
    $scope.selected = null;  // Deprecated
    $scope.ctrlPulsed = false;  // Select items with ctrl
    $scope.shiftPulsed = false;  // Select items with shift
    $scope.lastSelected = null;  // Last selection for shift range

    // Methods
    $scope.currentDirectory = null;

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

    $scope.indexOfEntry = function (item) {
        return $scope.entries.indexOf(item);
    }

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

    function setEntries(path) {
        $scope.isLoaded = false;
        $scope.entries = [];
        API.list(path).then(function (data) {
            $scope.entries = data;
            $scope.isLoaded = true;
        });
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
        // console.log('location change');
        $scope.currentDirectory = $location.path();
        setEntries($location.path());
        $scope.breadcrumb = getBreadcrumb($location.path());
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

});
