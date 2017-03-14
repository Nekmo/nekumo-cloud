/**
 * Created by nekmo on 12/03/17.
 */

Promise.all([
    require('angular')
]).then(function () {
    var module = angular.module('inputs', ['nekumo']);

    module.directive("compareTo", function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {
                 
                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue || "" == scope.otherModelValue || "";
                };
     
                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    });
});