/**
 * Created by nekmo on 8/03/17.
 */

Promise.all([
    require('angular'),
    require('angular-material')
]).then(function () {
    var module = angular.module('perms', ['ngMaterial']);
    var _ = require('lodash');

    function createFilterFor(query) {
      var lowercaseQuery = query.toLowerCase();

      return function(groupUser) {
        return (groupUser._lowername.indexOf(lowercaseQuery) != -1);
      };

    }

    // module.service('groupsUsers', function () {
    //     return function() {
    //         var gus = [
    //             {'name': 'Marina Augustine'},
    //             {'name': 'Oddr Sarno'},
    //             {'name': 'Nick Giannopoulos'}
    //         ];
    //         angular.forEach(gus, function (gu) {
    //             gu._lowername = gu.name.toLowerCase();
    //         });
    //         return gus;
    //     }
    // });

    module.directive('groupsUsers', function () {
        return {
            templateUrl: '/.nekumo/static/src/shared/perms/groupsUsers.html',
            controller: 'groupsUsersCtrl'
        }
    });

    module.controller('groupsUsersCtrl', function ($scope, GroupsUsersAPI) {
        $scope.querySearch = function(criteria) {
            return GroupsUsersAPI.filter({name: criteria});
            // return GroupsUsersAPI({name: criteria});
        }
    });

    module.service('$perms', function ($mdPanel) {
        var position = $mdPanel.newPanelPosition()
            .absolute()
            .center();

        return function (entry, ev) {
            var config = {
                attachTo: angular.element(document.body),
                controller: 'PermsCtrl',
                templateUrl: '/.nekumo/static/src/shared/perms/perms.html',
                hasBackdrop: true,
                panelClass: 'modal-panel',
                position: position,
                trapFocus: true,
                openFrom: ev,
                zIndex: 2,
                clickOutsideToClose: true,
                escapeToClose: true
            };

            $mdPanel.open(config);
        }
    });

    module.controller('PermsCtrl', function ($scope) {
        var self = this;

        $scope.perms = [
            {'name': 'Read'},
            {'name': 'Write'},
            {'name': 'Delete'}
        ];
        $scope.targets = [
            {'name': 'Recursive', 'value': 'RECURSIVE'},
            {'name': 'Subfiles', 'value': 'SUBFILES'},
            {'name': 'This', 'value': 'THIS'}
        ];

        $scope.permissions = [{groupsUsers: []}];
    });
});
