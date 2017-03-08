Promise.all([
    require('angular'),
    require("angular-animate"),
    require("angular-aria"),
    require("angular-material"),
    require("sprintf-js"),
    require('shared/perms/perms'),
    require('shared/fileManagerApi/fileManagerApi')
]).then(function(){
    var _ = require('lodash');
    var sprintf = require("sprintf-js").sprintf;

    var module = angular.module('fmOptions', ['ngMaterial', 'fileManagerApi', 'perms']);

    // module.factory('Dialog', function ($mdPanel) {
    //     var position = $mdPanel.newPanelPosition().absolute().center();
    //     var defaultConfig = {
    //         position: position,
    //         attachTo: angular.element(document.body),
    //         trapFocus: true,
    //         zIndex: 150,
    //         clickOutsideToClose: true,
    //         escapeToClose: true,
    //         focusOnOpen: true,
    //         disableParentScroll: false,
    //         hasBackdrop: true
    //     };
    //     function Dialog(config) {
    //         config = angular.extend(_.clone(defaultConfig), config);
    //         this.constructor.prototype.open = function () {
    //             $mdPanel.open(config);
    //         };
    //     }
    //     return Dialog
    // });

    function copyMoveDialog($rootScope, $mdToast, entries, countEntries) {
        $rootScope.pasteEntries = entries;

        $rootScope.pasteToast = $mdToast.show(
            $mdToast.simple()
                .action('Cancel')
                .textContent(sprintf('%s on the clipboard', countEntries(entries)))
                .hideDelay(0)
        );
        $rootScope.pasteToast.then(function(response) {
            if ( response == 'ok' ) {
                $rootScope.pasteAction = '';
                $rootScope.pasteEntries = [];
            }
        });

    }

    module.factory('countEntries', function () {
        return function(entry_entries){
            var typesNames = {directory: ['directory', 'directories'], file: ['file', 'files']};
            var entries = (_.isArray(entry_entries) ? entry_entries : [entry_entries]);
            if(!entries.length){
                return 'nothing'
            }
            var type = entries[0].type;
            for(var i = 0; i < entries.length; i++){
                if(entries[i].type != type){
                    return sprintf('%d %s and %s', entries.length, typesNames['directory'][1], typesNames['file'][1]);
                }
            }
            return sprintf('%d %s', entries.length, typesNames[type][(entries.length > 1 ? 1 : 0)]);
        };

    });


    module.filter('countEntries', function (countEntries) {
        return function (value) {
            return countEntries(value);
        }
    });


    module.factory('DeleteDialog', function ($mdDialog, API, countEntries) {
        var confirm = $mdDialog.confirm()
              .title('Are you sure to delete?')
              .ariaLabel('Confirm delete')
              .ok('Delete')
              .cancel('Cancel');

        function DeleteDialog(entry_entries, ev) {
            var confirmDialog = confirm;
            confirmDialog = confirmDialog.textContent('Delete ' + countEntries(entry_entries));

            if(ev){
                confirmDialog = confirmDialog.targetEvent(ev);
            }

            this.constructor.prototype.show = function () {
                $mdDialog.show(confirmDialog).then(function(newName) {
                    API.delete(entry_entries, newName);
                });
            };
        }

        return function (entry_entries, ev) {
            return new DeleteDialog(entry_entries, ev);
        };
    });

    module.factory('RenameDialog', function ($mdDialog, API) {
        var confirm = $mdDialog.prompt()
            .ariaLabel('Name')
            .ok('Rename')
            .cancel('Cancel');


        function RenameDialog(entry, ev) {
            var confirmDialog = confirm;
            var entryTypeName = (entry.isDir ? 'directory' : 'file');
            confirmDialog = confirmDialog.title('Rename ' + entryTypeName)
                .initialValue(entry.name)
                .textContent('Enter the new ' + entryTypeName + ' name.')
                .placeholder(entryTypeName + ' name');

            if(ev){
                confirmDialog = confirmDialog.targetEvent(ev);
            }

            this.constructor.prototype.show = function () {
                $mdDialog.show(confirmDialog).then(function(newName) {
                    API.rename(entry, newName);
                });
            };
        }
        return function (entry, ev) {
            return new RenameDialog(entry, ev);
        };
    });


    module.factory('CopyDialog', function ($rootScope, $mdToast, countEntries) {

        function CopyDialog(entries) {

            this.constructor.prototype.show = function () {
                $rootScope.pasteAction = 'copy';
                copyMoveDialog($rootScope, $mdToast, entries, countEntries)
            };
        }

        return function (entries, ev) {
            return new CopyDialog(entries, ev);
        };
    });


    module.factory('MoveDialog', function ($rootScope, $mdToast, countEntries) {

        function MoveDialog(entries) {

            this.constructor.prototype.show = function () {
                $rootScope.pasteAction = 'move';
                copyMoveDialog($rootScope, $mdToast, entries, countEntries)
            };
        }

        return function (entries, ev) {
            return new MoveDialog(entries, ev);
        };
    });


    module.factory('PasteDialog', function ($rootScope, $timeout, $mdToast, API, countEntries) {
        function PasteDialog(entry) {

            this.constructor.prototype.show = function () {
                API[$rootScope.pasteAction]($rootScope.pasteEntries, entry);
                $mdToast.hide($rootScope.pasteToast);

                $timeout(function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .action('Cancel')
                            .textContent(sprintf('%s pasted', countEntries($rootScope.pasteEntries)))
                            // .position(pinTo )
                            .hideDelay(1500)
                    );
                    $rootScope.pasteEntries = [];
                    $rootScope.pasteAction = '';
                }, 1000);
            };
        }

        return function (entries, ev) {
            return new PasteDialog(entries, ev);
        };
    });


    module.directive('options', function () {
        return {
            scope: {
                entry: '=',
                entries: '='
            },
            templateUrl: require('src/components/fileManager/options/options.html!ng-template').templateUrl
        }
    });

    module.controller('optionsCtrl', function ($scope, $rootScope, $window, RenameDialog, DeleteDialog, CopyDialog,
                                               MoveDialog, PasteDialog, $perms) {
        $scope.$rootScope = $rootScope;

        function getEntries(entry) {
            return _.union($scope.entries, [entry]);
        }

        $scope.openMenu = function($mdOpenMenu, ev) {
            console.log($scope.entries);
            // originatorEv = ev;
            $mdOpenMenu(ev);
        };

        $scope.download = function (entry) {
            $window.open(entry.path, '_blank');
        };

        $scope.openRename = function (entry, ev) {
            RenameDialog(entry, ev).show();
        };

        $scope.openDelete = function (entry, ev) {
            DeleteDialog(getEntries(entry), ev).show();
        };

        $scope.openCopy = function (entry, ev) {
            CopyDialog(getEntries(entry), ev).show()
        };

        $scope.openMove = function (entry, ev) {
            MoveDialog(getEntries(entry), ev).show()
        };

        $scope.openPaste = function (entry, ev) {
            PasteDialog(entry, ev).show()
        };

        $scope.openPermissions = function (entry, ev) {
            $perms(entry, ev)
        }
    });

    var renameDialogCtrl = function () {

    };
});