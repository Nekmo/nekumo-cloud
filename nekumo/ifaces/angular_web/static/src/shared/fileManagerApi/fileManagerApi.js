var module = angular.module('fileManagerApi', ['btford.socket-io']);
var API_NAMESPACE = 'api';
var API_PATH = '/.nekumo/io/';  // Este es el path que en realidad acompaña a la url
var WS_URL = sprintf('http://%s:%d/%s', document.domain, location.port, API_NAMESPACE);
var socket;

// module.config(function (socketFactoryProvider) {
//   socketFactoryProvider.prefix('');
// });

function createDict(key, value){
    var dict = {};
    dict[key] = value;
    return dict;
}

function entryEntriesDict(entry_entries){
    return createDict((_.isArray(entry_entries) ? 'entries' : 'entry'), entry_entries);
}

module.factory('API', function (socketFactory, $q) {
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
            return $q(function (resolve, reject) {
                socket.emit('list', {'entry': path}, resolve);
            });
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