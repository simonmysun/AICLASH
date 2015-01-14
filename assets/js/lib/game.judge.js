var Game = function() {
    var self = this;
    self.gameWorker = {terminate: function() {}};
    self.width = 100;
    self.height = 75;
    self.playerNum = 2;
    self.gnomeNum = 3;
    self.wait = 0;
    self.running = 0;
    self.paused = 0;
    self.timeLimit = 300 * 1000;
    self.delay = 0;
    self.started = 0;
    self.ended = 0;
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
        self.map.visited[0][0] = 3;
        self.map.visited[game.width - 1][game.height - 1] = 3;
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
        self.timeoutPlayers = 0;
        self.paused = 0;
        self.gameWorker = new Worker('./../assets/js/lib/game.worker.js');
        self.gameWorker.onmessage = function(sdata) {
            var data = sdata.data;
            if(data.type === 'update map') {
                self.map.data[data.data.x][data.data.y] = data.data.data;
                self.map.visited[data.data.x][data.data.y] = data.data.visited;
                painter.pushPaintEvent(data.data);
            } else if(data.type === 'update gnome') {
                self.gnomes[data.playerId][data.gnomeId].x = data.data.x;
                self.gnomes[data.playerId][data.gnomeId].y = data.data.y;
                self.gnomes[data.playerId][data.gnomeId].vision = data.data.vision;
            } else if(data.type === 'query') {
                var buf = [];
                for(var i = 0; i < self.playerNum; i++ ) {
                    buf[i] = self.updateInfo(i);
                }
                if(typeof data.id === 'number') {
                    var worker = playerWorkerList[data.id];
                    if(worker.time > 0) {
                        worker.timer = setTimeout(worker.fn, worker.time);
                        worker.timeStamp = performance.now();
                        worker.done = 0;
                        worker.postMessage({
                            type: 'query',
                            buf: buf[data.id]
                        });
                    } else {
                        worker.fn();
                    }
                } else {
                    for(var i = 0; i < self.playerNum; i ++ ) {
                        var worker = playerWorkerList[i];
                        if(worker.time > 0) {
                            worker.timer = setTimeout(worker.fn, worker.time);
                            worker.timeStamp = performance.now();
                            worker.done = 0;
                            worker.postMessage({
                                type: 'query',
                                buf: buf[i]
                            });
                        } else {
                            worker.fn();
                        }
                    }
                }
            } else if(data.type === 'tick') {
                for(var p in self.gnomes) {
                    for(var g in self.gnomes[p]) {
                        if(p === '0' && self.gnomes[p][g].x === self.width - 1 && self.gnomes[p][g].y === self.height - 1) {
                            self.endGame();
                            return;
                        }
                        if(p === '1' && self.gnomes[p][g].x === 0 && self.gnomes[p][g].y === 0) {
                            self.endGame();
                            return;
                        }
                    }
                }
            } else if(data.type === 'wait') {
                self.wait ++ ;
            } else if(data.type === 'done') {
                self.wait -- ;
            }
        };
        self.wait -- ;
    };
    self.updateInfo = function(player) {
        var buf = [];
        for(var i = 0; i < self.gnomeNum; i ++ ) {
            var locX = self.gnomes[player][i].x;
            var locY = self.gnomes[player][i].y;
            var vision = self.gnomes[player][i].vision;
            buf.push({
                type: 'gnome',
                id: i,
                x: locX,
                y: locY,
                vision: vision
            });
            for(var j = locX - vision - 1; j < locX + vision + 1; j ++ ) {
                for(var k = locY - vision - 1; k < locY + vision + 1; k ++ ) {
                    if(j < 0 || j > self.width - 1 || k < 0 || k > self.height - 1) {
                        continue;
                    }
                    if(Math.abs(j - locX) + Math.abs(k - locY) > vision) {
                        continue;
                    }
                    buf.push({
                        type: 'map',
                        x: j,
                        y: k,
                        data: self.map.data[j][k],
                        visited: self.map.visited[j][k][player ^ 1]
                    });
                }
            }
        }
        return buf;
    }
    self.resetWorkers = function() {
        self.gameWorker.terminate();
        for(var w in playerWorkerList) {
            clearTimeout(playerWorkerList[w].timer);
            playerWorkerList[w].terminate();
        }
        playerWorkerList = [];
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
    self.setScript = function(player, script) {
        playerScripts[player] = script;
    };
    self.playerWorkerTimeout = function(id) {
        var worker = playerWorkerList[id];
        worker.time = 0;
        clearTimeout(worker.timer);
        if(playerWorkerList[0].time <= 0 && playerWorkerList[1].time <= 0) {
            self.endGame();
        } else {
            worker.terminate();
            self.gameWorker.postMessage({
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
    self.run = function() {
        self.running = 1;
        self.started = 0;
        for(var player = 0; player < self.playerNum; player ++ ) {
            var worker = new Worker('./../assets/js/lib/worker.judge.js');
            var id = player;
            worker.done = 0;
            worker.id = player;
            worker.time = self.timeLimit;
            worker.timeStamp = 0;
            worker.timer = 0;
            var src = 'data:text/javascript;base64,' + Base64.encode(playerScripts[player] + ';;postMessage({type:"done"});');
            worker.fn = (function (wid) {
                return function () {
                    game.playerWorkerTimeout(wid);
                };
            })(worker.id);
            worker.timer = setTimeout(worker.fn, worker.time);
            worker.timeStamp = performance.now();
            worker.postMessage({
                type: 'init',
                src: src,
                width: self.width,
                height: self.height
            });
            var gm = self.gameWorker;
            var onmessage = function(sdata) {
                var data = sdata.data;
                if(this.done === 0) {
                    if(data.type === 'action') {
                        clearTimeout(this.timer);
                        this.time -= performance.now() - this.timeStamp;
                        this.done = 1;
                        if(typeof data.action === 'object') {
                            gm.postMessage({
                                type: 'action',
                                playerId: this.id,
                                action: [
                                    String(data.action[0]), 
                                    String(data.action[1]), 
                                    String(data.action[2])
                                ]
                            });
                        } else {
                            gm.postMessage({
                                type: 'action',
                                playerId: this.id,
                                action: [
                                    0, 
                                    0, 
                                    0
                                ]
                            });
                        }
                    } else if(data.type === 'done') {
                        clearTimeout(this.timer);
                        this.time -= performance.now() - this.timeStamp;
                        this.done = 1;
                        if(playerWorkerList[0].done === 1 && playerWorkerList[1].done === 1 && game.started === 0) {
                            self.gameWorker.postMessage({
                                type: 'start',
                            });
                            self.started = 1;
                        }
                    }
                }
            };
            worker.onmessage = onmessage;
            worker.errorMessage = '';
            worker.onerror = function(e){
                worker.errored = true;
                worker.errorMessage = e.message;
                //console.log(e.message);
                //console.log(e.lineno);
                //console.log(e.filename);
            };
            playerWorkerList = playerWorkerList.concat(worker);
        }
    };
    self.endGame = function() {
        if(self.ended === 1) {
            return;
        }
        self.ended = 1;
        var p1SuccFlag = 0;
        var p2SuccFlag = 0;
        for(var p in self.gnomes) {
            for(var g in self.gnomes[p]) {
                if(p === '0' && self.gnomes[p][g].x === self.width - 1 && self.gnomes[p][g].y === self.height - 1) {
                    p1SuccFlag = 1;
                }
                if(p === '1' && self.gnomes[p][g].x === 0 && self.gnomes[p][g].y === 0) {
                    p2SuccFlag = 1;
                }
            }
        }
        if(p1SuccFlag === 1 && p2SuccFlag === 1) {
            b.result = b.result.concat('Draw. \n');
        } else if(p1SuccFlag === 1) {
            b.result = b.result.concat('Player 0 win. \n');
        } else if(p2SuccFlag === 1) {
            b.result = b.result.concat('Player 1 win. \n');
        } else {
            b.result = b.result.concat('Draw, both failed. \n');
        }
        for(var w in playerWorkerList) {
            var worker = playerWorkerList[w];
            worker.terminate();
            clearTimeout(worker.timer);
            if(worker.errored) {
                b.comment = b.comment.concat('Error from player ' + w + ': ' + worker.errorMessage);
            }
            b.comment = b.comment.concat('Player ' + w + ' time remained: ' + worker.time + '. \n');
        }
        b.comment = b.comment.concat('End time: ' + new Date() + '\n');
        (function downloadUrl(fileName, Url){
            var aLink = document.createElement('a');
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", false, false);
            aLink.download = fileName;
            aLink.href = Url;
            aLink.dispatchEvent(evt);
        })('' + new Date().getTime() + '-' + players[currBattle.p1].teamId + '-' + players[currBattle.p2].teamId, document.getElementById('canvas').toDataURL("image/png"));
        result.push(b);
        storageCurrentStatus();
        window.location.reload();
    };
    return self;
};

window.onerror = function(msg,url,line){
   //alert(msg,url,line);
}
