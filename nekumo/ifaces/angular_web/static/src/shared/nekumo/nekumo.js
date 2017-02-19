/**
 * Created by nekmo on 31/01/17.
 */

System.import('github:angular/bower-angular@1.6.2').then(function () {
    var module = angular.module('nekumo', ['ngMaterial', 'oc.lazyLoad']);

    module.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: true
        });
    }]);

    module.service('lazySystem', function ($ocLazyLoad) {
        function load (src, key) {
            // var deferred = $q.defer();
            return SystemJS.import(src, key).then(function (loadedFile) {
                return $ocLazyLoad.load({type: 'js', name: key});
                // return $ocLazyLoad.load(loadedFile[key || 'default']);
                // return $ocLazyLoad.load(src);
            });
            // return deferred.promise;
        }

        this.load = load;
    });

    module.controller('nekumoCtrl', function ($scope, $mdSidenav) {
        $scope.toggleSidenav = function(sidenavId){
            $mdSidenav(sidenavId).toggle();
        };
    });
});

