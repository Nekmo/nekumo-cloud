System.config({
  baseURL: "/.nekumo/static/",
  defaultJSExtensions: true,
  transpiler: false,
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "src/libs/github/*",
    "npm:*": "src/libs/npm/*"
  },
  separateCSS: true,
  defaultExtension: "js",

  map: {
    "./angular-material.css!css": "@empty",
    "Templarian/MaterialDesign-Webfont": "github:Templarian/MaterialDesign-Webfont@1.8.36",
    "angular": "github:angular/bower-angular@1.6.3",
    "angular-animate": "github:angular/bower-angular-animate@1.6.2",
    "angular-aria": "github:angular/bower-angular-aria@1.6.2",
    "angular-material": "github:angular/bower-material@1.1.3",
    "angular-messages": "github:angular/bower-angular-messages@1.6.3",
    "angular-socket-io": "npm:angular-socket-io@0.7.0",
    "angular-ui-router": "npm:angular-ui-router@1.0.0-rc.1",
    "angular/bower-material": "github:angular/bower-material@1.1.3",
    "balliegojr/angular-event-dispatcher": "github:balliegojr/angular-event-dispatcher@0.0.3",
    "ccampbell/mousetrap": "github:ccampbell/mousetrap@1.6.0",
    "chieffancypants/angular-hotkeys": "github:chieffancypants/angular-hotkeys@1.7.0",
    "components": "src/components",
    "css": "github:systemjs/plugin-css@0.1.32",
    "danielstern/ngAudio": "github:danielstern/ngAudio@1.7.3",
    "epayet/angular-event-dispatcher": "github:epayet/angular-event-dispatcher@1.0.5",
    "erykpiast/angular-duration-format": "github:erykpiast/angular-duration-format@1.0.1",
    "lodash": "npm:lodash@4.17.4",
    "ng-template": "github:jamespamplin/plugin-ng-template@0.1.1",
    "ocombe/ocLazyLoad": "github:ocombe/ocLazyLoad@1.1.0",
    "shared": "src/shared",
    "socket.io-client": "github:socketio/socket.io-client@1.7.2",
    "sprintf-js": "npm:sprintf-js@1.0.3",
    "videogular": "npm:videogular@1.4.4",
    "videogular-buffering": "npm:videogular-buffering@1.4.4",
    "videogular-controls": "npm:videogular-controls@1.4.4",
    "videogular-overlay-play": "npm:videogular-overlay-play@1.4.4",
    "videogular-themes-default": "npm:videogular-themes-default@1.4.4",
    "github:angular/bower-angular-animate@1.6.2": {
      "angular": "github:angular/bower-angular@1.6.3"
    },
    "github:angular/bower-angular-aria@1.6.2": {
      "angular": "github:angular/bower-angular@1.6.3"
    },
    "github:angular/bower-angular-messages@1.6.3": {
      "angular": "github:angular/bower-angular@1.6.3"
    },
    "github:angular/bower-material@1.1.3": {
      "angular": "github:angular/bower-angular@1.6.3",
      "angular-animate": "github:angular/bower-angular-animate@1.6.2",
      "angular-aria": "github:angular/bower-angular-aria@1.6.2",
      "css": "github:systemjs/plugin-css@0.1.32"
    },
    "github:chieffancypants/angular-hotkeys@1.7.0": {
      "angular": "github:angular/bower-angular@1.6.3"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.9"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "npm:angular-ui-router@1.0.0-rc.1": {
      "angular": "npm:angular@1.6.3",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "ui-router-core": "npm:ui-router-core@3.1.0"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.8",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:isarray@1.0.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:process@0.11.9": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:ui-router-core@3.1.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:videogular-buffering@1.4.4": {
      "videogular": "npm:videogular@1.4.4"
    },
    "npm:videogular-controls@1.4.4": {
      "videogular": "npm:videogular@1.4.4"
    },
    "npm:videogular-overlay-play@1.4.4": {
      "videogular": "npm:videogular@1.4.4"
    },
    "npm:videogular-themes-default@1.4.4": {
      "videogular": "npm:videogular@1.4.4"
    },
    "npm:videogular@1.4.4": {
      "angular": "github:angular/bower-angular@1.6.3",
      "angular-sanitize": "npm:angular-sanitize@1.6.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    }
  }
});
