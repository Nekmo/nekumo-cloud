var module = angular.module('FileManagerApp').config(['fileManagerConfigProvider', function (config) {
    var defaults = config.$get();
    config.set({
        appName: 'angular-filemanager',
        tplPath: '/.nekumo/static/own_libs/angular-filemanager/src/templates',
        pickCallback: function(item) {
            var msg = 'Picked %s "%s" for external use'
                .replace('%s', item.type)
                .replace('%s', item.fullPath());
            window.alert(msg);
        },
        allowedActions: angular.extend(defaults.allowedActions, {
            changePermissions: true,
            pickFiles: false,
            pickFolders: false
        }),
        enablePermissionsRecursive: true
    });
}]);

