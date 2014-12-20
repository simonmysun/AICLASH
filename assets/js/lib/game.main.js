
var Game = function() {
    var self = this;
    self.gameWorker = {terminate: function() {}};
    self.width = 200;
    self.height = 150;
    self.playerNum = 2;
    self.gnomeNum = 3;
    self.wait = 0;
    self.running = 0;
    self.delay = 0;
    var playerWorkerList = [];
    var playerScripts = [];
    self.init = function() {
        self.resetWorkers();
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
        self.map.visited[0][0] = 1000;
        self.map.visited[game.width - 1][game.height - 1] = 1000;
        self.gnomes = [];
        self.gnomes[0] = [];
        for(var g = 0; g < 3; g ++ ) {
            var gnome = {};
            gnome.x = 0;
            gnome.y = 0;
            gnome.vision = 15;
            self.gnomes[0].push(gnome);
        }
        self.gnomes[1] = [];
        for(var g = 0; g < 3; g ++ ) {
            var gnome = {};
            gnome.x = game.width - 1;
            gnome.y = game.height - 1;
            gnome.vision = 15;
            self.gnomes[1].push(gnome);
        }
        self.gameWorker = new Worker('./../assets/js/lib/game.worker.js');
        self.gameWorker.onmessage = function(sdata) {
            var data = sdata.data;
            if(data.type === 'update map') {
                self.map.data[data.data.x][data.data.y] = data.data.data;
                self.map.visited[data.data.x][data.data.y] = data.data.visited;
                painter.pushPaintEvent(data.data);
            }
            if(data.type === 'update gnome') {
                self.gnomes[data.playerId][data.gnomeId].x = data.data.x;
                self.gnomes[data.playerId][data.gnomeId].y = data.data.y;
                self.gnomes[data.playerId][data.gnomeId].vision = data.data.x || self.gnomes[data.playerId][data.gnomeId].vision;
            }
            if(data.type === 'query') {
                stats.end();
                stats.begin();
                var doSth = function() {
                    if(typeof data.id === 'number') {
                        playerWorkerList[data.id].postMessage({
                            type: 'query',
                            game: self.limitedMap(data.id)
                        });
                    } else {
                        for(var i = 0; i < self.playerNum; i ++ ) {
                            playerWorkerList[i].postMessage({
                                type: 'query',
                                game: self.limitedMap(i)
                            });
                        }
                    }
                };
                //setTimeout(doSth, self.delay);
                doSth();
            }
            if(data.type === 'wait') {
                self.wait ++ ;
            }
            if(data.type === 'done') {
                self.wait -- ;
            }
        };
        self.wait -- ;
    };
    self.limitedMap = function(player) {
        var game = {};
        game.width = self.width;
        game.height = self.height;
        game.gnomes = [];
        game.map = {};
        game.map.data = [];
        game.map.visited = [];
        for(var i = 0; i < self.gnomeNum; i ++ ) {
            var locX = self.gnomes[player][i].x;
            var locY = self.gnomes[player][i].y;
            var vision = self.gnomes[player][i].vision;
            //vision = 2; //FIXME
            game.gnomes[i] = {
                x: locX,
                y: locY,
                vision: vision
            };
            for(var j = locX - vision; j < locX + vision; j ++ ) {
                for(var k = locY - vision; k < locY + vision; k ++ ) {
                    if(j < 0 || j > self.width - 1 || k < 0 || k > self.width - 1) {
                        continue;
                    }
                    if(Math.abs(j - locX) + Math.abs(k - locY) > vision) {
                        continue;
                    }
                    if(typeof game.map.data[j] != 'object') {
                        game.map.data[j] = [];
                        game.map.visited[j] = [];
                    }
                    game.map.data[j][k] = self.map.data[j][k];
                    game.map.visited[j][k] = self.map.visited[j][k];
                }
            }
        }
        return game;
    }
    self.resetWorkers = function() {
        self.gameWorker.terminate();
        for(var w in playerWorkerList) {
            playerWorkerList[w].terminate();
        }
    };
    self.resetMap = function() {
        self.wait ++ ;
        self.init();
        self.gameWorker.postMessage({
            type: 'init',
            data: {
                method: 'random kruskal',
                width: self.width,
                height: self.height
            }
        });
        self.wait -- ;
        painter.renderAll();
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
            var id = player;
            worker.id = player;
            var src = 'data:text/javascript;base64,' + Base64.encode(playerScripts[player]);
            worker.postMessage({
                type: 'init',
                src: src
            });
            var gm = self.gameWorker;
            var onmessage = function(sdata) {
                var data = sdata.data;
                if(data.type = 'action') {
                    if(typeof data.action === 'object') {
                        gm.postMessage({
                            type: 'action',
                            playerId: this.id, // why?
                            action: [
                                String(data.action[0]), 
                                String(data.action[1]), 
                                String(data.action[2])
                            ]
                        });
                    } else {
                        gm.postMessage({
                            type: 'action',
                            playerId: id,
                            action: [
                                0, 
                                0, 
                                0
                            ]
                        });
                        
                    }
                }
            };
            worker.onmessage = onmessage;
            worker.onerror = function(e){
                console.log(e.message);
                console.log(e.lineno);
                console.log(e.filename);
            };
            playerWorkerList = playerWorkerList.concat(worker);
        }
        self.gameWorker.postMessage({
            type: 'start',
        });
    };
    return self;
};
