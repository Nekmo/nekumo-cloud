var module = angular.module('fmOptions', ['ngMaterial', 'fileManagerApi']);

module.factory('Dialog', function ($mdPanel) {
    var position = $mdPanel.newPanelPosition().absolute().center();
    var defaultConfig = {
        position: position,
        attachTo: angular.element(document.body),
        trapFocus: true,
        zIndex: 150,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: true,
        disableParentScroll: false,
        hasBackdrop: true
    };
    function Dialog(config) {
        config = angular.extend(_.clone(defaultConfig), config);
        this.constructor.prototype.open = function () {
            $mdPanel.open(config);
        };
    }
    return Dialog
});

module.factory('deleteDialog', function ($mdDialog, API) {
    var confirm = $mdDialog.confirm()
          .title('Are you sure to delete?')
          .textContent('All of the banks have agreed to forgive you your debts.')
          .ariaLabel('Confirm delete')
          .targetEvent(ev)
          .ok('Please do it!')
          .cancel('Sounds like a scam');

    function DeleteDialog(entry_entries, ev) {
        var confirmDialog = confirm;
        confirmDialog = confirmDialog.textContent('Delete ' + countEntries(entry_entries));

        if(ev){
            confirmDialog = confirmDialog.targetEvent(ev);
        }

        this.constructor.prototype.open = function () {
            this.show();
        };

        this.constructor.prototype.show = function () {
            $mdDialog.show(confirmDialog).then(function(newName) {
                API.delete(entry, newName);
            });
        };
    }

    return function (entry_entries, ev) {
        return new DeleteDialog(entry_entries, ev);
    };
});

module.factory('RenameDialog', function ($mdDialog, API) {
        // Appending dialog to document.body to cover sidenav in docs app
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
        this.constructor.prototype.open = function () {
            this.show();
        };

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

module.directive('options', function () {
    return {
        scope: {
            entry: '='
        },
        templateUrl: '/.nekumo/static/src/components/fileManager/options/options.html'
    }
});

module.controller('optionsCtrl', function ($scope, RenameDialog) {

    $scope.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };

    $scope.openRename = function (entry, ev) {
        RenameDialog(entry, ev).open();
    }
});

var renameDialogCtrl = function () {

};