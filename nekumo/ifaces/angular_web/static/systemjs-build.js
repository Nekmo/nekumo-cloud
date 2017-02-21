var path = require("path");
var Builder = require('systemjs-builder');

// optional constructor options
// sets the baseURL and loads the configuration file
var builder = new Builder('.', 'config.js');

// https://github.com/systemjs/plugin-css/issues/118
// var bundleOpts = {
//     sourceMaps: false,
//     minify: true,
//     mangle: true,
//     runtime: false,
//     normalize: true
// };

// Por alguna extraña razón, el css de media.css está en el de fileManager.css


builder.bundle('src/components/media/media.js & src/components/fileManager/manager.js', 'dist/common.js').then(function() {
    builder.bundle('src/components/media/media.js - dist/common.js', 'dist/media.js').then(function () {
        builder.bundle('src/components/fileManager/manager.js - dist/common.js', 'dist/fileManager.js');
        console.log('Build complete');
    });

})
.catch(function(err) {
  console.log('Build error');
  console.log(err);
});
