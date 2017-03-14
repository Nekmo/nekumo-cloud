/**
 * Created by nekmo on 10/03/17.
 */

Promise.all([
    require('angular'),

    require('components/admin/tabs/users/users.css!css')
]).then(function () {
    var module = angular.module('adminUsers', ['nekumo', 'fileManagerApi']);

    module.config(function($mdThemingProvider) {

        // Configure a dark theme with primary foreground yellow

        $mdThemingProvider.theme('alert-dark', 'default')
          .primaryPalette('yellow')
          .dark();

      });

    module.controller('adminUsersCtrl', function ($scope, UsersAPI, GroupsAPI, $stateParams) {
        UsersAPI.all().then(function (users) {
            $scope.users = users;
        });

        GroupsAPI.all().then(function (groups) {
            $scope.groups = groups;
        });

        $scope.message = $stateParams.message;
    });
});
