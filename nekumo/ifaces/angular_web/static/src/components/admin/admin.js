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
            controller: 'adminUsersCtrl',
            params: {message: ''}
        };

        var userFormCreate = {
            name: 'userForm',
            url: '/users/add',
            templateUrl: '/.nekumo/static/src/shared/user/userForm.html',
            controller: 'userFormCtrl',
            resolve: {
                user: function () {
                    return null;
                },
                onSuccess: function ($state) {
                    return function (user) {
                        $state.go('users', {message: {
                            body: 'User ' + user.toString() + ' has been created successfully.',
                            type: 'success'
                        }});
                    };
                }
            }
        };

        var userFormUpdate = {
            name: 'userFormUpdate',
            url: '/users/{userId}',
            templateUrl: '/.nekumo/static/src/shared/user/userForm.html',
            controller: 'userFormCtrl',
            resolve: {
                user: function(UsersAPI, $transition$) {
                    return UsersAPI.get($transition$.params().userId);
                },
                onSuccess: function ($state) {
                    return function (user) {
                        $state.go('users', {message: {
                            body: 'User ' + user.toString() + ' has been updated successfully.',
                            type: 'success'
                        }});
                    };
                },
                onDelete: function ($state) {
                    return function (user) {
                        $state.go('users', {message: {
                            body: 'User ' + user.toString() + ' has been deleted successfully.',
                            type: 'danger'
                        }});
                    };
                }
            }
        };

        var groupFormUpdate = {
            name: 'groupFormUpdate',
            url: '/groups/{groupId}',
            templateUrl: '/.nekumo/static/src/shared/user/groupForm.html',
            controller: 'groupFormCtrl',
            resolve: {
                group: function(UsersAPI, $transition$) {
                    return UsersAPI.get($transition$.params().groupId);
                },
                onSuccess: function ($state) {
                    return function (group) {
                        $state.go('groups', {message: {
                            body: 'User ' + group.toString() + ' has been updated successfully.',
                            type: 'success'
                        }});
                    };
                },
                onDelete: function ($state) {
                    return function (group) {
                        $state.go('groups', {message: {
                            body: 'User ' + group.toString() + ' has been deleted successfully.',
                            type: 'danger'
                        }});
                    };
                }
            }
        };

        $stateProvider.state(home);
        $stateProvider.state(users);
        $stateProvider.state(userFormCreate);
        $stateProvider.state(userFormUpdate);
        $stateProvider.state(groupFormUpdate);
    });

    module.controller('adminCtrl', function ($scope) {
        $scope.templates = {
            menu: require('src/components/admin/menu.html!ng-template')
        }
    });
});