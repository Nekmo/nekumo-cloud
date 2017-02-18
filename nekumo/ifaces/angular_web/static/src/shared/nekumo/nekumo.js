/**
 * Created by nekmo on 31/01/17.
 */

System.import('github:angular/bower-angular@1.6.2').then(function () {
    var module = angular.module('nekumo', ['ngMaterial']);


    module.controller('nekumoCtrl', function ($scope, $mdSidenav) {
        $scope.toggleSidenav = function(sidenavId){
            $mdSidenav(sidenavId).toggle();
        };
    });
});

