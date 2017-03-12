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
    require('shared/user/user'),

    require('src/shared/theme/theme.css!css'),
    require('src/components/media/media.css!css')
]).then(function () {
    var module = angular.module('adminApp', [
        'nekumo', 'fileManagerApi', 'ui.router', 'adminMenu', 'adminUsers', 'userForm'
    ]);

    module.config(function($stateProvider) {
        var home = {
            name: 'home',
            url: '/home',
            template: '<h3>hello world!</h3>'
        };

        var users = {
            name: 'users',
            url: '/users',
            templateUrl: '/.nekumo/static/src/components/admin/tabs/users/users.html',
            controller: 'adminUsersCtrl'
        };

        var userForm = {
            name: 'userForm',
            url: '/users/add',
            templateUrl: '/.nekumo/static/src/shared/user/userForm.html',
            controller: 'userFormCtrl'
        };

        $stateProvider.state(home);
        $stateProvider.state(users);
        $stateProvider.state(userForm);
    });

    module.controller('adminCtrl', function ($scope) {
        $scope.templates = {
            menu: require('src/components/admin/menu.html!ng-template')
        }
    });
});