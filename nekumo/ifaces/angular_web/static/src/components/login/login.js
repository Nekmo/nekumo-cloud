/**
 * Created by nekmo on 16/03/17.
 */
var LOGIN_URL = '/.nekumo/login';

Promise.all([
    require('angular'),
    require('shared/nekumo/nekumo'),
    require('shared/utils/utils'),

    require('src/shared/theme/theme.css!css'),
    require('src/components/login/login.css!css')

    // Html templates
    // require('/.nekumo/static/src/components/fileManager/sidenavs/main/main-sidenav.html!ng-template'),
    // require('/.nekumo/static/src/components/fileManager/views/grid/grid-view.html!ng-template'),
    // require('/.nekumo/static/src/components/fileManager/views/list/list-view.html!ng-template'),
    // require('/.nekumo/static/src/components/fileManager/sidenavs/details/details-sidenav.html!ng-template')
]).then(function () {
    var module = angular.module('loginApp', ['nekumo', 'utils']);

    module.controller('loginCtrl', function ($scope, $http) {
        $scope.data = {};

        $scope.notImplemented = function () {
            alert('This feature is not yet available.');
        };

        $scope.submit = function () {
            $http.post(LOGIN_URL, $scope.data);
        }
    });
});
