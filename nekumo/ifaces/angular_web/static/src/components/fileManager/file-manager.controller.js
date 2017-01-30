
var module = angular.module('app.file-manager', ['ngMaterial', 'fileManagerApi', 'utils', 'fmOptions', 'app.core']);



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

module.controller('FileManagerController', function($rootScope, $scope, $mdSidenav, $location, API, Entry) {
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
    $scope.currentView = 'list';
    // $scope.currentView = 'grid';
    $scope.showDetails = true;

    $scope.isLoaded = false;
    $scope.entries = [];
    $scope.selected = null;

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

    $scope.select = function(item) {
        $scope.selected = item;
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
});
