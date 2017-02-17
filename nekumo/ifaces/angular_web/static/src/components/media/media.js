

var module = angular.module('mediaApp', ['nekumo', 'preview', 'chromecast', 'fileManagerApi']);

module.directive('media', function () {
    return {
        scope: {
            selectedSrc: '='
        },
        templateUrl: '/.nekumo/static/src/components/media/media.html'
    }
});

module.controller('mediaCtrl', function ($rootScope, $scope, $previewGallery, $chromecastPlayer, $location, API) {

    $chromecastPlayer();
    
    $scope.currentDirectory = null;
    $scope.category = 'all';

    // $previewGallery({
    //     player: 'video',
    //     src: $scope.selectedSrc,
    //     mimeType: 'video/mp4'
    // });

    function setEntries(path) {
        $scope.isLoaded = false;
        $scope.entries = [];
        $scope.videoEntries = [];
        $scope.audioEntries = [];
        $scope.imageEntries = [];
        $scope.otherEntries = [];
        API.list(path).then(function (data) {
            // $scope.entries = data;
            $scope.isLoaded = true;
            angular.forEach(data, function (item) {
                var entries = $scope[item.category + 'Entries'];
                entries = (entries !== undefined ? entries : $scope.otherEntries);
                entries.push(item);
            })
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

module.directive('grid', function () {
    return {
        scope: {
            entries: '=',
            title: '@',
            isSelected: '='
        },
        templateUrl: '/.nekumo/static/src/components/media/grid.html'
    }
});

module.controller('gridCtrl', function ($scope, $previewGallery) {
    $scope.preview = function (entry) {
        $previewGallery(entry, $scope.entries);
    }
});
