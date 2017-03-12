/**
 * Created by nekmo on 12/03/17.
 */
Promise.all([
    require('angular'),
    require('shared/nekumo/nekumo'),
    require('shared/fileManagerApi/fileManagerApi')
]).then(function () {
    var module = angular.module('userForm', ['nekumo', 'fileManagerApi']);
    var _ = require('lodash');

    module.config(function($mdThemingProvider) {

        // Configure a dark theme with primary foreground yellow

        $mdThemingProvider.theme('docs-dark', 'default')
          .primaryPalette('yellow')
          .dark();

      });

    module.directive('groupsSelector', function () {
        return {
            scope: {
              ngModel: '='
            },
            templateUrl: '/.nekumo/static/src/shared/user/groups-selector.html',
            controller: 'groupsSelectorCtrl'
        };
    });

    module.controller('groupsSelectorCtrl', function ($scope, groupsAPI) {
        /**
         * Return the proper object when the append is called.
        */
        var self = this;

        groupsAPI.all().then(function (groups) {
            self.groups = _.map(groups, function (x) {
                x._lowername = x.name.toLowerCase();
                return x;
            });
        });

        $scope.transformChip = function(chip) {
          // If it is an object, it's already a known chip
          if (angular.isObject(chip)) {
            return chip;
          }

          // Otherwise, create a new one
          return { name: chip, type: 'new' }
        };

        /**
         * Search for vegetables.
         */
        $scope.querySearch = function(query) {
          var results = query ? self.groups.filter(createFilterFor(query)) : [];
          return results;
        };

        /**
         * Create filter function for a query string
         */
        createFilterFor = function(query) {
          var lowercaseQuery = angular.lowercase(query);

          return function filterFn(group) {
            return (group._lowername.indexOf(lowercaseQuery) === 0);
          };

        }
    });


    module.controller('userFormCtrl', function ($scope) {
        $scope.user = {
            groups: [{name: 'foo'}, {name: 'spam'}]
        };

        $scope.save = function () {

        }
    });
});