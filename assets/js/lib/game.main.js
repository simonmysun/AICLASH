var Game = function() {
    var self = this;
    var gameWorker;
    self.width = 200;
    self.height = 150;
    self.playerNum = 2;
    self.gnomeNum = 3;
    self.wait = 0;
    self.running = 0;
    var playerWorkerList = [];
    var playerScripts = [];
    self.init = function() {
        self.wait ++ ;
        self.map = {
            data: [],
            visited: []
        };
        for(var i = 0; i < self.width; i ++ ) {
            self.map.data[i] = [];
            self.map.visited[i] = [];
            for(var j = 0; j < self.height; j ++ ) {
                self.map.data[i][j] = 0;
                self.map.visited[i][j] = [];
                for(var k = 0; k < self.playerNum; k ++ ) {
                    self.map.visited[i][j][k] = 0;
                }
            }
        }
        gameWorker = new Worker('./../assets/js/lib/game.worker.js');
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
            if(data.type === 'wait') {
                self.wait ++ ;
            }
            if(data.type === 'done') {
                self.wait -- ;
            }
        }
        self.wait -- ;
    };
    self.resetWorkers = function() {
        gameWorker.terminate();
        for(var w in playerWorkerList) {
            playerWorkerList[w].terminate();
        }
    };
    self.reset = function() {
        self.wait ++ ;
        self.resetWorkers();
        self.init();
        painter.clearPaintQueue();
        painter.renderAll();
        self.wait -- ;
    };
    self.pause = function() {
        self.running |= 1;
    };
    self.setScript = function(player, script) {
        playerScripts[player] = script;
    };
    self.run = function() {
        self.running = 1;
        for(var player = 0; player < self.playerNum; player ++ ) {
            var worker = new Worker('./../assets/js/lib/worker.js');
            var src = 'data:text/javascript;base64,' + Base64.encode(playerScripts[player]);
            worker.postMessage({
                type: 'init',
                src: src
            });
            worker.onerror = function(e){
                console.log(e.message);
                console.log(e.lineno);
                console.log(e.filename);
            };
            playerWorkerList.push(worker);
        }
    };
    self.update = function() {
        if(running) {
            
        }
    }
    return self;
};
