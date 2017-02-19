
Promise.all([
    require('angular'),
    require('shared/nekumo/nekumo'),
    require('components/fileManager/file-manager.controller'),
    require('shared/utils/utils')
]).then(function () {
    var module = angular.module('fileManager', ['nekumo', 'app.file-manager', 'utils']);
});
