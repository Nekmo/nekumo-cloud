Promise.all([
    require('angular'),
    require('angular-socket-io')
]).then(function () {

    var sprintf = require('sprintf-js').sprintf;
    var io = require('socket.io-client');
    var _ = require('lodash');

    var module = angular.module('fileManagerApi', ['btford.socket-io']);
    var API_NAMESPACE = 'api';
    var API_PATH = '/.nekumo/io/';  // Este es el path que en realidad acompaña a la url
    var WS_URL = sprintf('http://%s:%d/%s', document.domain, location.port, API_NAMESPACE);
    var ICON_FONT = 'mdi';
    var socket;

    var MIMETYPE_ICONS = {
        'inode/directory': ['folder', 'folder'],

        'application/pdf': ['file-pdf-box', 'pdf'],

        'application/x-compressed-tar': ['zip-box', 'compressed'],
        'application/zip': ['zip-box', 'compressed'],


        'application/xml': ['code-not-equal-variant', 'code'],
        'application/x-php': ['language-php', 'code'],
        'text/x-python': ['language-python', 'code'],

        'application/vnd.oasis.opendocument.text': ['file-document-box', 'document'],

        'video': ['filmstrip', 'video'],
        'image': ['image', 'image'],
        'audio': ['music-box', 'audio'],
        'text': ['file-document-box', 'document'],
        '': ['help-circle', 'unknown']
    };

    var MIMETYPE_CATEGORIES = {
        'video': 'video',
        'image': 'image',
        'text': 'text',
        'audio': 'audio'
    };

    // module.config(function (socketFactoryProvider) {
    //   socketFactoryProvider.prefix('');
    // });

    function classIcon(icon, name) {
        return ICON_FONT + ' ' + ICON_FONT + '-' + icon + ' icon-' + name;
    }

    function createDict(key, value) {
        var dict = {};
        dict[key] = value;
        return dict;
    }

    function entryEntriesDict(entry_entries) {
        return createDict((_.isArray(entry_entries) ? 'entries' : 'entry'), entry_entries);
    }

    function getPath(entry_entries) {
        if (_.isArray(entry_entries)) {
            return _.map(entry_entries, function (x) {
                return x.path
            });
        } else {
            return entry_entries.path;
        }
    }

    function getMime(mimetype) {
        var mime = null;
        if (mimetype) {
            mime = mimetype.split('/')[0];
        }
        return mime;
    }

    function getColorClass(mimetype) {
        return (_.get(MIMETYPE_ICONS, mimetype, _.get(MIMETYPE_ICONS, getMime(mimetype))) || MIMETYPE_ICONS[''])[1];
    }

    function getIconClass(mimetype) {
        var mime = null;
        if (mimetype) {
            mime = mimetype.split('/')[0];
        }
        var classes = _.get(MIMETYPE_ICONS, mimetype, _.get(MIMETYPE_ICONS, mime)) || MIMETYPE_ICONS[''];
        return classIcon(classes[0], classes[1]);
    }

    function getCategory(mimetype) {
        var mime = null;
        if (mimetype) {
            mime = mimetype.split('/')[0];
        }
        return _.get(MIMETYPE_CATEGORIES, mimetype, _.get(MIMETYPE_CATEGORIES, mime));
    }

    Entry = function (data) {
        angular.extend(this, {
            "type": "folder",
            "icon_class": "mdi mdi-folder icon-folder",
            "owner": "me",
            "size": "1.2 Mb",
            "modified": "July 8, 2015",
            "opened": "July 8, 2015",
            "created": "July 8, 2015",
            "extention": "",
            "location": "My Files > Documents",
            "offline": true,
            "isDir": true,
            "preview": "/.nekumo/static/src/components/fileManager/sample-file-preview.jpg"
        });
        angular.extend(this, data);

        // this.mimetype = this.mimetype || '';
        this.modified = new Date(data.mtime);
        this.opened = new Date(data.atime);
        this.isDir = this.type == 'directory';
        this.icon_class = getIconClass(this.mimetype);
        this.tags = [];

        if (this.parentDir && !_.endsWith(this.parentDir, '/')) {
            this.parentDir += '/';
        }
        if (!this.name) {
            this.name = _.last(_.trim(this.path, '/').split('/'));
        } else if (!this.path) {
            this.path = this.parentDir + this.name;
        }
        if (this.isDir && !_.endsWith(this.path, '/')) {
            this.path += '/';
        }
        this.category = getCategory(this.mimetype);
        this.colorClass = getColorClass(this.mimetype);

    };


    module.factory('Entry', function () {
        return function (data) {
            return new Entry(data);
        }
    });

    module.factory('API', function (socketFactory, $q, Entry) {
        // var ioSocket = io(WS_URL, {path: API_NAMESPACE});
        // var ioSocket = io({transports: ['websocket'], upgrade: false});
        // // var socket = socketFactory({ioSocket: ioSocket});
        // var socket = socketFactory({prefix: '/', ioSocket: ioSocket});
        // socket.emit('foo');

        if (!socket) {
            var ioSocket = io.connect(WS_URL, {transports: ['websocket'], upgrade: false, path: API_PATH});
            socket = socketFactory({ioSocket: ioSocket});
        }

        // ioSocket.on('connect', function() {
        //     ioSocket.emit('joined', {});
        // });
        // ioSocket.on('status', function(data) {
        //     console.debug('data!');
        // });


        return {
            list: function (path) {
                var deferred = $q.defer();
                socket.emit('list', {'entry': path}, function (data) {
                    deferred.resolve(_.map(data, function (x) {
                        return Entry(_.extend(x, {parentDir: path}))
                    }));
                });
                return deferred.promise;
                // return $q(function (resolve, reject) {
                //     socket.emit('list', {'entry': path}, resolve);
                // });
            },
            watch: function (entry) {
                return $q(function (resolve, reject) {
                    socket.emit('watch', {'entry': entry}, resolve);
                });
            },
            rename: function (entry, newName) {
                if (_.isObject(entry)) {
                    entry = entry.path;
                }
                return $q(function (resolve, reject) {
                    socket.emit('rename', {'entry': entry, 'new_name': newName}, resolve);
                })
            },
            move: function (entry_entries, target) {
                return $q(function (resolve, reject) {
                    socket.emit('move', _.extend(entryEntriesDict(getPath(entry_entries)), {target: target.path}), resolve);
                });
            },
            copy: function (entry_entries, target) {
                // TODO: incompleto
                return $q(function (resolve, reject) {
                    socket.emit('copy', _.extend(entryEntriesDict(getPath(entry_entries)), {target: target.path}), resolve);
                });
            },
            details: function (entry) {
                if (_.isObject(entry)) {
                    entry = entry.path;
                }
                return $q(function (resolve, reject) {
                    socket.emit('details', {'entry': entry}, function (data) {
                        resolve(Entry(data));
                    });
                })
            },
            delete: function (entry_entries) {
                return $q(function (resolve, reject) {
                    socket.emit('delete', entryEntriesDict(getPath(entry_entries)), resolve);
                });
            }
        }
    });
});