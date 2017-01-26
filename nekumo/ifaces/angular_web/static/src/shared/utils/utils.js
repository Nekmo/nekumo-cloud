

var module = angular.module('utils', []);

module.provider('utilsConfig', function() {
    var values = {
        useDecimalByteSizePrefixes: false
    };
    return {
        $get: function() {
            return values;
        },
        set: function (constants) {
            angular.extend(values, constants);
        }
    };
});

module.filter('humanReadableFileSize', ['$filter', 'utilsConfig', function($filter, utilsConfig) {
  // See https://en.wikipedia.org/wiki/Binary_prefix
  var decimalByteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  var binaryByteUnits = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  return function(input) {
    var i = -1;
    var fileSizeInBytes = input;

    do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
    } while (fileSizeInBytes > 1024);

    var result = utilsConfig.useDecimalByteSizePrefixes ? decimalByteUnits[i] : binaryByteUnits[i];
    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + ' ' + result;
  };
}]);
