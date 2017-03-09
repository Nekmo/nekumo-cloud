/**
 * Created by nekmo on 9/03/17.
 */
Promise.all([
    require('angular'),
    require('angular-ui-router'),
    require("angular-animate"),
    require("angular-aria"),
    require("angular-material"),
    require('shared/nekumo/nekumo'),
    require('shared/fileManagerApi/fileManagerApi'),

    require('src/components/admin/menu.css!css')

]).then(function () {
    var module = angular.module('adminMenu', ['nekumo', 'fileManagerApi', 'ui.router']);

    module.controller('adminMenuCtrl', function () {

    });
});