
Promise.all([
    require('angular'),
    require('shared/nekumo/nekumo'),
    require('components/fileManager/file-manager.controller'),
    require('shared/utils/utils'),

    require('src/shared/theme/theme.css!css'),
    require('src/components/fileManager/file-manager.css!css'),
    require('src/components/fileManager/options/options.css!css')

    // Html templates
    // require('/.nekumo/static/src/components/fileManager/sidenavs/main/main-sidenav.html!ng-template'),
    // require('/.nekumo/static/src/components/fileManager/views/grid/grid-view.html!ng-template'),
    // require('/.nekumo/static/src/components/fileManager/views/list/list-view.html!ng-template'),
    // require('/.nekumo/static/src/components/fileManager/sidenavs/details/details-sidenav.html!ng-template')
]).then(function () {
    var module = angular.module('fileManager', ['nekumo', 'app.file-manager', 'utils']);
});
