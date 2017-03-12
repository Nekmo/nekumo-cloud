/**
 * Created by nekmo on 10/03/17.
 */

Promise.all([
    require('angular'),

    require('components/admin/tabs/users/users.css!css')
]).then(function () {
    var module = angular.module('adminUsers', ['nekumo', 'fileManagerApi']);
    module.controller('adminUsersCtrl', function ($scope) {
        $scope.users = [
            {name: 'foo', type: 'superuser', email: 'contacto@nekmo.com', 'groups': ['test']},
            {name: 'foo spam spam', type: 'superuser', email: 'contacto@nekmo.com', 'groups': ['test', '2', '4']}
        ];

        $scope.groups = $scope.users;
    });
});
