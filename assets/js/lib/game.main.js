if (!window.performance) {
    window.performance = {
        now: function () {
            return new Date();
        }
    };
}

var Game = function () {
    var self = this;
    self.gameWorker = { terminate: function () { } };
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
    var playerWorkerList = [];
    var playerScripts = [];
    self.init = function () {
        self.resetWorkers();
        self.wait++;
        self.map = {
            data: [],
            visited: []
        };
        for (var i = 0; i < self.width; i++) {
            self.map.data[i] = [];
            self.map.visited[i] = [];
            for (var j = 0; j < self.height; j++) {
                self.map.data[i][j] = 0;
                self.map.visited[i][j] = [];
                for (var k = 0; k < self.playerNum; k++) {
                    self.map.visited[i][j][k] = 0;
                }
            }
        }
        self.map.visited[0][0] = 1000;
        self.map.visited[game.width - 1][game.height - 1] = 1000;
        self.gnomes = [];
        self.gnomes[0] = [];
        for (var g = 0; g < 3; g++) {
            var gnome = {};
            gnome.x = 0;
            gnome.y = 0;
            gnome.vision = 15;
            self.gnomes[0].push(gnome);
        }
        self.gnomes[1] = [];
        for (var g = 0; g < 3; g++) {
            var gnome = {};
            gnome.x = game.width - 1;
            gnome.y = game.height - 1;
            gnome.vision = 15;
            self.gnomes[1].push(gnome);
        }
        self.timeoutPlayers = 0;
        self.paused = 0;
        self.gameWorker = new Worker('./../assets/js/lib/game.worker.js');
        self.gameWorker.onmessage = function (sdata) {
            var data = sdata.data;
            if (data.type === 'update map') {
                self.map.data[data.data.x][data.data.y] = data.data.data;
                self.map.visited[data.data.x][data.data.y] = data.data.visited;
                painter.pushPaintEvent(data.data);
            } else if (data.type === 'update gnome') {
                self.gnomes[data.playerId][data.gnomeId].x = data.data.x;
                self.gnomes[data.playerId][data.gnomeId].y = data.data.y;
                self.gnomes[data.playerId][data.gnomeId].vision = data.data.vision;
                if ((data.playerId === 0) && (data.data.x === self.width - 1) && (data.data.y === self.height - 1)) {
                }
                if ($('#fog').attr('data-fog') === 'false') {

                } else {
                    var polygon = '';
                    polygon = polygon.concat('polygon(0% 0%, ');
                    for (var p in self.gnomes) {
                        for (var g in self.gnomes[p]) {
                            var gnome = self.gnomes[p][g];
                            polygon = polygon.concat(((gnome.x) / self.width * 100) + '% ' + ((gnome.y - gnome.vision) / self.height * 100) + '%, ');
                            polygon = polygon.concat(((gnome.x + gnome.vision) / self.width * 100) + '% ' + ((gnome.y) / self.height * 100) + '%, ');
                            polygon = polygon.concat(((gnome.x) / self.width * 100) + '% ' + ((gnome.y + gnome.vision) / self.height * 100) + '%, ');
                            polygon = polygon.concat(((gnome.x - gnome.vision) / self.width * 100) + '% ' + ((gnome.y) / self.height * 100) + '%, ');
                            polygon = polygon.concat(((gnome.x) / self.width * 100) + '% ' + ((gnome.y - gnome.vision) / self.height * 100) + '%, ');
                            polygon = polygon.concat('0% 0%, ');
                        }
                    }
                    polygon = polygon.substr(0, polygon.length - 2).concat(')')
                    $('#fog').css('-webkit-clip-path', polygon);
                    $('#fog').css('clip-path', polygon);
                }
            } else if (data.type === 'query') {
                stats.end();
                stats.begin();
                var buf = [];
                for (var i = 0; i < self.playerNum; i++) {
                    buf[i] = self.updateInfo(i);
                }
                if (typeof data.id === 'number') {
                    var worker = playerWorkerList[data.id];
                    if (worker.time > 0) {
                        setTimeout((function (worker, buf, game) {
                            return function () {
                                if (game.paused === 0) {
                                    worker.timer = setTimeout(worker.fn, worker.time);
                                    worker.timeStamp = performance.now();
                                    worker.done = 0;
                                    worker.postMessage({
                                        type: 'query',
                                        buf: buf
                                    });
                                } else {
                                    setTimeout(arguments.callee, 15);
                                }
                            };
                        })(worker, buf[data.id], self), 15);
                    } else {
                        worker.fn();
                    }
                } else {
                    for (var i = 0; i < self.playerNum; i++) {
                        var worker = playerWorkerList[i];
                        if (worker.time > 0) {
                            setTimeout((function (worker, buf, game) {
                                return function () {
                                    if (game.paused === 0) {
                                        worker.timer = setTimeout(worker.fn, worker.time);
                                        worker.timeStamp = performance.now();
                                        worker.done = 0;
                                        worker.postMessage({
                                            type: 'query',
                                            buf: buf
                                        });
                                    } else {
                                        setTimeout(arguments.callee, 15);
                                    }
                                };
                            })(worker, buf[i], self), 15);
                        } else {
                            worker.fn();
                        }
                    }
                }
            } else if (data.type === 'wait') {
                self.wait++;
            } else if (data.type === 'done') {
                self.wait--;
            }
        };
        self.wait--;
    };
    self.updateInfo = function (player) {
        var buf = [];
        for (var i = 0; i < self.gnomeNum; i++) {
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
            for (var j = locX - vision - 1; j < locX + vision + 1; j++) {
                for (var k = locY - vision - 1; k < locY + vision + 1; k++) {
                    if (j < 0 || j > self.width - 1 || k < 0 || k > self.height - 1) {
                        continue;
                    }
                    if (Math.abs(j - locX) + Math.abs(k - locY) > vision) {
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
    self.resetWorkers = function () {
        self.gameWorker.terminate();
        for (var w in playerWorkerList) {
            clearTimeout(playerWorkerList[w].timer);
            playerWorkerList[w].terminate();
        }
        playerWorkerList = [];
    };
    self.resetMap = function () {
        self.wait++;
        self.init();
        self.gameWorker.postMessage({
            type: 'init',
            data: {
                method: 'random kruskal',
                width: self.width,
                height: self.height
            }
        });
        self.wait--;
        painter.renderAll();
    };
    self.pause = function () {
        self.paused ^= 1;
    };
    self.setScript = function (player, script) {
        playerScripts[player] = script;
    };
    self.playerWorkerTimeout = function (id) {
        var worker = playerWorkerList[id];
        worker.time = 0;
        clearTimeout(worker.timer);
        if (playerWorkerList[0].time <= 0 && playerWorkerList[1].time <= 0) {
            $('#btn-run').click();
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
    self.run = function () {
        self.running = 1;
        self.started = 0;
        for (var player = 0; player < self.playerNum; player++) {
            var worker = new Worker('./../assets/js/lib/worker.js');
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
            var onmessage = function (sdata) {
                var data = sdata.data;
                if (this.done === 0) {
                    if (data.type === 'action') {
                        clearTimeout(this.timer);
                        this.time -= performance.now() - this.timeStamp;
                        this.done = 1;
                        if (typeof data.action === 'object') {
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
                    } else if (data.type === 'done') {
                        clearTimeout(this.timer);
                        this.time -= performance.now() - this.timeStamp;
                        this.done = 1;
                        if (playerWorkerList[0].done === 1 && playerWorkerList[1].done === 1 && game.started === 0) {
                            self.gameWorker.postMessage({
                                type: 'start',
                            });
                            self.started = 1;
                        }
                    }
                }
            };
            worker.onmessage = onmessage;
            worker.onerror = function (e) {
                //console.log(e.message);
                //console.log(e.lineno);
                //console.log(e.filename);
            };
            playerWorkerList = playerWorkerList.concat(worker);
        }
    };
    return self;
};

window.onerror = function (msg, url, line) {
    //alert(msg,url,line);
}
