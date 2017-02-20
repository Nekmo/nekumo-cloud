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

  map: {
    "Templarian/MaterialDesign-Webfont": "github:Templarian/MaterialDesign-Webfont@1.8.36",
    "angular": "github:angular/bower-angular@1.6.2",
    "angular-animate": "github:angular/bower-angular-animate@1.6.2",
    "angular-aria": "github:angular/bower-angular-aria@1.6.2",
    "angular-material": "github:angular/bower-material@1.1.3",
    "angular-socket-io": "npm:angular-socket-io@0.7.0",
    "balliegojr/angular-event-dispatcher": "github:balliegojr/angular-event-dispatcher@0.0.3",
    "ccampbell/mousetrap": "github:ccampbell/mousetrap@1.6.0",
    "chieffancypants/angular-hotkeys": "github:chieffancypants/angular-hotkeys@1.7.0",
    "components": "src/components",
    "danielstern/ngAudio": "github:danielstern/ngAudio@1.7.3",
    "epayet/angular-event-dispatcher": "github:epayet/angular-event-dispatcher@1.0.5",
    "erykpiast/angular-duration-format": "github:erykpiast/angular-duration-format@1.0.1",
    "lodash": "npm:lodash@4.17.4",
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
      "angular": "github:angular/bower-angular@1.6.2"
    },
    "github:angular/bower-angular-aria@1.6.2": {
      "angular": "github:angular/bower-angular@1.6.2"
    },
    "github:angular/bower-material@1.1.3": {
      "angular": "github:angular/bower-angular@1.6.2",
      "angular-animate": "github:angular/bower-angular-animate@1.6.2",
      "angular-aria": "github:angular/bower-angular-aria@1.6.2",
      "css": "github:systemjs/plugin-css@0.1.32"
    },
    "github:chieffancypants/angular-hotkeys@1.7.0": {
      "angular": "github:angular/bower-angular@1.6.2"
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
      // "angular": "npm:angular@1.6.2",
      "angular": "github:angular/bower-angular@1.6.2",
      "angular-sanitize": "npm:angular-sanitize@1.6.2"
    }
  }
});
