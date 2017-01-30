(function ()
{
    'use strict';

    angular
        .module('app.file-manager',
            [
                // 3rd Party Dependencies
                'flow'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.file-manager', {
            url      : '/file-manager',
            views    : {
                'content@app': {
                    templateUrl: '/.nekumo/static/src/components/fileManager/file-manager.html',
                    controller : 'FileManagerController as vm'
                }
            },
            resolve  : {
                Documents: function (msApi)
                {
                    return msApi.resolve('fileManager.documents@get');
                }
            },
            bodyClass: 'file-manager'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/apps/file-manager');

        // Api
        msApiProvider.register('fileManager.documents', ['app/data/file-manager/documents.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('apps.file-manager', {
            title : 'File Manager',
            icon  : 'icon-folder',
            state : 'app.file-manager',
            weight: 6
        });
    }

})();