var Game = function() {
    var self = this;
    self.width = 200;
    self.height = 150;
    self.map = {
        data: [],
        visited: []
    };
    for(var i = 0; i < self.width; i ++ ) {
        self.map.data[i] = [];
        for(var j = 0; j < self.height; j ++ ) {
            self.map.data[i][j] = 0;
            }
    }
    var gameWorker = new Worker('./../assets/js/lib/game.worker.js');
    gameWorker.postMessage({
        type: 'init',
        data: {
            method: 'random kruskal',
            width: self.width,
            height: self.height
        }
    });
    gameWorker.onmessage = function(sdata) {
        var data = sdata.data;
        if(data.type === 'update map') {
            self.map.data[data.data.x][data.data.y] = data.data.data;
            painter.pushPaintEvent(data.data);
        }
    }
    self.reset = function() {
        
    };
    return self;
};
