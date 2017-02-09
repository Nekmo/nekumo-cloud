

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

    // $previewGallery({
    //     player: 'video',
    //     src: $scope.selectedSrc,
    //     mimeType: 'video/mp4'
    // });

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

module.controller('gridCtrl', function ($scope) {

});

module.directive('gridItem', function () {
    return {
        scope: {
            entry: '='
        },
        templateUrl: '/.nekumo/static/src/components/media/grid-item.html'
    }
});

module.controller('gridItemCtrl', function ($scope, $previewGallery) {
    $scope.preview = function () {
        $previewGallery($scope.entry);
    }
});