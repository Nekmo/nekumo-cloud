/**
 * Created by nekmo on 9/03/17.
 */
Promise.all([
    require('angular'),
    require('angular-ui-router'),
    require("angular-animate"),
    require("angular-aria"),
    require("angular-material"),
    require('shared/nekumo/nekumo'),
    require('shared/fileManagerApi/fileManagerApi'),

    require('components/admin/menu'),

    require('components/admin/tabs/users/users'),

    require('src/shared/theme/theme.css!css'),
    require('src/components/media/media.css!css')
]).then(function () {
    var module = angular.module('adminApp', [
        'nekumo', 'fileManagerApi', 'ui.router', 'adminMenu', 'adminUsers'
    ]);

    module.config(function($stateProvider) {
        var helloState = {
            name: 'home',
            url: '/home',
            template: '<h3>hello world!</h3>'
        };

        var aboutState = {
            name: 'users',
            url: '/users',
            templateUrl: '/.nekumo/static/src/components/admin/tabs/users/users.html',
            controller: 'adminUsersCtrl'
        };

        $stateProvider.state(helloState);
        $stateProvider.state(aboutState);
    });

    module.controller('adminCtrl', function ($scope) {
        $scope.templates = {
            menu: require('src/components/admin/menu.html!ng-template')
        }
    });
});