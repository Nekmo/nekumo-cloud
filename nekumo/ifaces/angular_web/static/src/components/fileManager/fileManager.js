var module = angular.module('FileManagerApp').config(['fileManagerConfigProvider', function (config) {
    var defaults = config.$get();
    config.set({
        appName: 'angular-filemanager',
        tplPath: 'static/own_libs/angular-filemanager/src/templates',
        pickCallback: function(item) {
            var msg = 'Picked %s "%s" for external use'
                .replace('%s', item.type)
                .replace('%s', item.fullPath());
            window.alert(msg);
        },
        allowedActions: angular.extend(defaults.allowedActions, {
            pickFiles: false,
            pickFolders: false
        })
    });
}]);