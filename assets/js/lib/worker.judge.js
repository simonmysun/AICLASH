importScripts('stdlib.js');

["performance", "indexedDB", "webkitIndexedDB", "navigator", "console", "onerror", "location", "self", "setTimeout", "clearTimeout", "setInterval", "clearInterval", "webkitRequestFileSystem", "webkitRequestFileSystemSync", "webkitResolveLocalFileSystemURL", "webkitResolveLocalFileSystemSyncURL", "addEventListener", "removeEventListener", "FileReaderSync", "FileReader", "FileList", "File", "dispatchEvent", 'document', 'window', 'history', 'XMLHttpRequest', 'sessionStorage', 'localStorage', 'Notification', 'Worker', 'WebSocket', "onerror", "onlanguageChange", "onoffline", "alert", "requestAnimationFrame", "webkitRequestAnimationFrame"].map(function(x) {
    if(typeof this[x] === 'function') {
        this[x] = function() {};
    } else if(typeof this[x] === 'number') {
        this[x] = 0;
    } else if(typeof this[x] === 'object') {
        this[x] = {};
    } else if(typeof this[x] === 'string') {
        this[x] = '';
    } else {
        this[x] = undefined;
    }
});

var game = {};

onmessage = function(sdata) {
    var data = sdata.data;
    if(data.type === 'init') {
        importScripts(data.src);
        game.src = data.src;
        game.width = data.width;
        game.height = data.height;
        game.map = {};
        game.map.data = [];
        game.map.visited = [];
        game.gnomes = [];
        for(var i = 0; i < game.width; i ++ ) {
            game.map.data[i] = [];
            game.map.visited[i] = [];
        }
    } else if(data.type === 'query') {
        for(var i in data.buf) {
            if(data.buf[i].type === 'gnome') {
                game.gnomes[data.buf[i].id] = {
                    x: data.buf[i].x,
                    y: data.buf[i].y,
                    vision: data.buf[i].vision
                };
            } else {
                game.map.data[data.buf[i].x][data.buf[i].y] = data.buf[i].data;
                game.map.visited[data.buf[i].x][data.buf[i].y] = data.buf[i].visited;
            }
        }
        postMessage({
            type: 'action',
            action: onMyTurn(game)
        });
    }
};

var onMyTurn = function() {
    return [0, 0, 0];
};
