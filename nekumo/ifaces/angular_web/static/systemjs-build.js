var path = require("path");
var Builder = require('systemjs-builder');

// optional constructor options
// sets the baseURL and loads the configuration file
var builder = new Builder('.', 'config.js');
var BUNDLES = [
    ['src/components/media/media.js & src/components/fileManager/manager.js', 'dist/common.js'],
    ['src/components/media/media.js - dist/common.js', 'dist/media.js'],
    ['src/components/fileManager/manager.js - dist/common.js', 'dist/fileManager.js'],
    ['src/shared/audioPlayer/audioPlayer.js - dist/common.js', 'dist/audioPlayer.js'],
    ['src/shared/videoPlayer/videoPlayer.js - dist/common.js', 'dist/videoPlayer.js']
];

var sequence = function(promises) {
    if(!promises.length){ return }
    var promise = promises[0];
    builder.bundle(promise[0], promise[1]).then(function () {
        sequence(promises.splice(1));
    });
};

sequence(BUNDLES);