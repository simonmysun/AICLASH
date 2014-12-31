importScripts('map.js');
importScripts('algorithms.js');
importScripts('stdlib.js');

onmessage = function(sdata) {
    var data = sdata.data;
    if(data.type === 'init') {
        game.init(data.data.width, data.data.height, data.data.method);
    } else if(data.type === 'reset') {
        game = new Game();
    } else if(data.type === 'start') {
        game.update();
    } else if(data.type === 'action') {
        game.reduceAction.reduce(data);
    }
};

var updateMap = function(data) {
    postMessage({
        type: 'update map',
        data: {
            x: data.x,
            y: data.y,
            data: data.data,
            visited: data.visited || game.map.visited[data.x][data.y] || 0
        }
     });
};

var updateGnome = function(playerId, gnomeId, gnome) {
    postMessage({
        type: 'update gnome',
        playerId: playerId,
        gnomeId: gnomeId,
        data: {
            x: gnome.x,
            y: gnome.y,
            vision: gnome.vision
        }
    });
};

var gnomeTurnLeft = function(dir) {
    dir >>= 1;
    if(dir === 0) {
        dir = 8;
    }
    return dir;
}

var gnomeTurnRight = function(dir) {
    dir <<= 1;
    if(dir > 8) {
        dir = 1;
    }
    return dir;
}

function Game() {
    var self = this;
    var signal;
    var currAction = [];
    self.init = function(width, height, method) {
        postMessage({
            type: 'wait'
        });
        self.width = width;
        self.height = height;
        self.map = new Map(self.width, self.height);
        self.map.init();
        self.map.visited[0][0][0] = 3;
        self.map.visited[game.width - 1][game.height - 1][1] = 3;
        self.map.generate(method);
        self.gnomeNum = 3;
        self.playerNum = 2;
        self.gnomes = [];
        self.gnomes[0] = [];
        self.buff = [1, 1];
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
        postMessage({
            type: 'done'
        });
    };
    self.reduceAction = new function() {
        var self = this;
        self.init = function(signal, callback) {
            self.signal = signal;
            self.callback = callback;
        };
        self.reduce = function(data) {
            if(self.signal >= 1) {
                self.signal -= 1;
                currAction.push({
                    id: data.playerId, 
                    action: data.action
                });
                if(self.signal <= 0) {
                    self.callback();
                }
            }
        };
        return self;
    };
    self.check = function(src, dir) {
        if((self.map.data[src.x][src.y] & dir) > 0) {
            return true;
        } else {
            return false;
        }
    };
    self.update = function() {
        currAction = [];
        var randomQuery = Math.floor(Math.random() * 2);
        self.reduceAction.init(1, function() {
            postMessage({
                type: 'query',
                id: randomQuery
            });
            self.reduceAction.init(1, function() {
                for(var k in currAction) {
                    var player = currAction[k].id;
                    for(var i = 0; i < 3; i ++ ) {
                        var currGnome = self.gnomes[currAction[k].id][i];
                        var action = parseInt(currAction[k].action[i]);
                        var availableActions = [];
                        var actionAvailable = false;
                        for(var j = 1; j < 16; j *= 2) {
                            if(self.check(currGnome, j) === true) {
                                availableActions.push(j);
                                if(j === action) {
                                    actionAvailable = true;
                                }
                            }
                        }
                        if(actionAvailable === false) {
                            //console.log('Action unavailable. ');
                            action = availableActions[Math.floor(Math.random() * availableActions.length)];
                        }
                        if(action === 1) {
                            currGnome.y -= 1;
                        }
                        if(action === 2) {
                            currGnome.x += 1;
                        }
                        if(action === 4) {
                            currGnome.y += 1;
                        }
                        if(action === 8) {
                            currGnome.x -= 1;
                        }
                        self.map.visited[currGnome.x][currGnome.y][player] += 1;
                        if(self.buff[0] >= 1) {
                            if(currGnome.x === 0 && currGnome.y === self.height - 1) {
                                currGnome.vision *= 2;
                                self.buff[0] -= 1;
                            }
                        }
                        if(self.buff[1] >= 1) {
                            if(currGnome.x === self.width - 1 && currGnome.y === 0) {
                                currGnome.vision *= 2;
                                self.buff[1] -= 1;
                            }
                        }
                        updateGnome(player, i, currGnome);
                        updateMap({
                            x: currGnome.x,
                            y: currGnome.y,
                            data: self.map.data[currGnome.x][currGnome.y],
                            visited: self.map.visited[currGnome.x][currGnome.y]
                        });
                    }
                }
                self.update();
            });
        });
        postMessage({
            type: 'query',
            id: randomQuery ^ 1
        });
    };
    self.update_con = function() {
        currAction = [];
        postMessage({
            type: 'query'
        });
        self.reduceAction.init(2, function() {
            for(var k in currAction) {
                var player = currAction[k].id;
                for(var i = 0; i < 3; i ++ ) {
                    var currGnome = self.gnomes[currAction[k].id][i];
                    var action = parseInt(currAction[k].action[i]);
                    var availableActions = [];
                    var actionAvailable = false;
                    for(var j = 1; j < 16; j *= 2) {
                        if(self.check(currGnome, j) === true) {
                            availableActions.push(j);
                            if(j === action) {
                                actionAvailable = true;
                            }
                        }
                    }
                    if(actionAvailable === false) {
                        //console.log('Action unavailable. ');
                        action = availableActions[Math.floor(Math.random() * availableActions.length)];
                    }
                    if(action === 1) {
                        currGnome.y -= 1;
                    }
                    if(action === 2) {
                        currGnome.x += 1;
                    }
                    if(action === 4) {
                        currGnome.y += 1;
                    }
                    if(action === 8) {
                        currGnome.x -= 1;
                    }
                    self.map.visited[currGnome.x][currGnome.y][player] += 1;
                    if(self.buff[0] >= 1) {
                        if(currGnome.x === 0 && currGnome.y === self.height - 1) {
                            currGnome.vision *= 2;
                            self.buff[0] -= 1;
                        }
                    }
                    if(self.buff[1] >= 1) {
                        if(currGnome.x === self.width - 1 && currGnome.y === 0) {
                            currGnome.vision *= 2;
                            self.buff[1] -= 1;
                        }
                    }
                    updateGnome(player, i, currGnome);
                    updateMap({
                        x: currGnome.x,
                        y: currGnome.y,
                        data: self.map.data[currGnome.x][currGnome.y],
                        visited: self.map.visited[currGnome.x][currGnome.y]
                    });
                }
            }
            self.update_con();
        });
    };
    return self;
}

var game = new Game();
