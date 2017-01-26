var module = angular.module('fileManagerApi', ['btford.socket-io']);
var API_NAMESPACE = 'api';
var API_PATH = '/.nekumo/io/';  // Este es el path que en realidad acompaña a la url
var WS_URL = sprintf('http://%s:%d/%s', document.domain, location.port, API_NAMESPACE);
var ICON_FONT = 'mdi';
var socket;

var MIMETYPE_ICONS = {
    'inode/directory': classIcon('folder', 'folder'),

    'application/pdf': classIcon('file-pdf-box', 'pdf'),

    'application/x-compressed-tar': classIcon('zip-box', 'compressed'),
    'application/zip': classIcon('zip-box', 'compressed'),


    'application/xml': classIcon('code-not-equal-variant', 'code'),
    'application/x-php': classIcon('language-php', 'code'),
    'text/x-python': classIcon('language-python', 'code'),

    'application/vnd.oasis.opendocument.text': classIcon('file-document-box', 'document'),

    'video': classIcon('filmstrip', 'video'),
    'image': classIcon('image', 'image'),
    'audio': classIcon('music-box', 'audio'),
    'text': classIcon('file-document-box', 'document'),
    '': classIcon('help-circle', 'unknown')
};

// module.config(function (socketFactoryProvider) {
//   socketFactoryProvider.prefix('');
// });

function classIcon(icon, name){
    return ICON_FONT + ' ' + ICON_FONT + '-' + icon + ' icon-' + name;
}

function createDict(key, value){
    var dict = {};
    dict[key] = value;
    return dict;
}

function entryEntriesDict(entry_entries){
    return createDict((_.isArray(entry_entries) ? 'entries' : 'entry'), entry_entries);
}


function getIconClass(mimetype){
    var mime = null;
    if(mimetype){
        mime = mimetype.split('/')[0];
    }
    return _.get(MIMETYPE_ICONS, mimetype, _.get(MIMETYPE_ICONS, mime)) || MIMETYPE_ICONS[''];
}

Entry = function(data) {
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
        "preview": "assets/images/etc/sample-file-preview.jpg"
    });
    angular.extend(this, data);

    this.isDir = this.type == 'directory';
    this.icon_class = getIconClass(this.mimetype);
    console.debug(this.icon_class);
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

    if(!socket){
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
                deferred.resolve(_.map(data, Entry));
            });
            return deferred.promise;
            // return $q(function (resolve, reject) {
            //     socket.emit('list', {'entry': path}, resolve);
            // });
        },
        rename: function (entry, newPath) {
            return $q(function (resolve, reject) {
                socket.emit('rename', {'entry': entry, 'new_path': newPath}, resolve);
            })
        },
        move: function (entry, dest) {
            // TODO: incompleto
            return $q(function (resolve, reject) {
                socket.emit('move', {'entry': entry, 'new_name': newName}, resolve);
            });
        },
        delete: function (entry_entries) {
            return $q(function (resolve, reject) {
                socket.emit('delete', entryEntriesDict(entry_entries), resolve);
            });
        }
    }
});