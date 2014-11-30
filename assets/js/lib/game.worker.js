importScripts('map.js');
importScripts('algorithms.js');

onmessage = function(sdata) {
    var data = sdata.data;
    if(data.type === 'init') {
        game.init(data.data.width, data.data.height, data.data.method);
    }
    if(data.type === 'reset') {
        game = new Game();
    }
}

var updateMap = function(data) {
    postMessage({
        type: 'update map',
        data: data // {x, y, mapData}
    });
}

function Game() {
    var self = this;
    self.init = function(width, height, method) {
        self.width = width;
        self.height = height;
        self.map = new Map(self.width, self.height);
        self.map.init();
        self.map.generate(method);
    }
    return self;
}

var game = new Game();
