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

    module.service('groupsUsers', function () {
        return function() {
            var gus = [
                {'name': 'Marina Augustine'},
                {'name': 'Oddr Sarno'},
                {'name': 'Nick Giannopoulos'}
            ];
            angular.forEach(gus, function (gu) {
                gu._lowername = gu.name.toLowerCase();
            });
            return gus;
        }
    });

    module.service('$perms', function ($mdPanel, groupsUsers) {
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

    module.controller('PermsCtrl', function ($scope, groupsUsers) {
        var self = this;
        $scope.groupsUsers = groupsUsers();
        $scope.perms = [
            {'name': 'Read'},
            {'name': 'Write'},
            {'name': 'Create'},
            {'name': 'Delete'},
            {'name': 'Admin'}
        ];

        $scope.permissions = [{groupsUsers: []}];

        $scope.querySearch = function(criteria) {
          return criteria ? _.filter($scope.groupsUsers, createFilterFor(criteria)) : [];
        }
    });
});
