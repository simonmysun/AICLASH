var Map = function(width, height) {
    var self = this;
    self.width = width;
    self.height = height;
    self.init = function() {
        self.data = [];
        self.visited = [];
        for(var i = 0; i < self.width; i ++ ) {
            self.data[i] = [];
            self.visited[i] = [];
            for(var j = 0; j < self.height; j ++ ) {
                self.data[i][j] = 0;
                self.visited[i][j] = [0, 0];
            }
        }
    };
    self.legal = function(x, y) {
        if((x < 0) || (x >= self.width) || (y < 0) || (y >= self.height)) {
            return false;
        } else {
            return true;
        }
    };
    var number = function(x, y) {
        return x + y * self.width;
    }
    var direction = function(from, to) {
        if(from.y == to.y + 1) {
            return 1;
        }
        if(from.x == to.x - 1) {
            return 2;
        }
        if(from.y == to.y - 1) {
            return 4;
        }
        if(from.x == to.x + 1) {
            return 8;
        }
    }
    self.edgeList = function() {
        var edgeList = [];
        edgeList.randomPop = function() {
            if(edgeList.length == 1) {
                return edgeList.pop();
            }
            var rand = Math.floor(Math.random() * edgeList.length);
            var res = edgeList[rand];
            edgeList[rand] = edgeList.pop();
            return res;
        }
        for(var i = 0; i < width; i ++ ) {
            for(var j = 0; j < height; j ++ ) {
/*
                if(self.legal(i, j - 1)) {
                    edgeList.push({
                        from: {
                            x: i,
                            y: j
                        },
                        to: {
                            x: i,
                            y: j - 1
                        }
                    });
                }
*/
                if(self.legal(i + 1, j)) {
                    edgeList.push({
                        from: {
                            x: i,
                            y: j
                        },
                        to: {
                            x: i + 1,
                            y: j
                        }
                    });
                }
                if(self.legal(i, j + 1)) {
                    edgeList.push({
                        from: {
                            x: i,
                            y: j
                        },
                        to: {
                            x: i,
                            y: j + 1
                        }
                    });
                }
/*
                if(self.legal(i - 1, j)) {
                    edgeList.push({
                        from: {
                            x: i,
                            y: j
                        },
                        to: {
                            x: i - 1,
                            y: j
                        }
                    });
                }
*/
            }
        }
        return edgeList;
    };
    self.generate = function(method, passRate) {
        postMessage({
            type: 'wait'
        });
        if(method === 'random kruskal') {
            var edgeList = self.edgeList();
            var set = new Set(self.width * self.height);
            var process = function() {
                for(var x = 0; x < Math.min(edgeList.length, 30); x ++ ) {
                    var e = edgeList.randomPop();
                    if(set.check(number(e.from.x, e.from.y), number(e.to.x, e.to.y)) == false) {
                        set.merge(number(e.from.x, e.from.y), number(e.to.x, e.to.y));
                        self.data[e.from.x][e.from.y] |= direction(e.from, e.to);
                        self.data[e.to.x][e.to.y] |= direction(e.to, e.from);
                        updateMap({
                            x: e.from.x,
                            y: e.from.y,
                            data: self.data[e.from.x][e.from.y]
                        });
                        updateMap({
                            x: e.to.x,
                            y: e.to.y,
                            data: self.data[e.to.x][e.to.y]
                        });
                    } else {
                        if(Math.random() < 0.01) {
                            self.data[e.from.x][e.from.y] |= direction(e.from, e.to);
                            self.data[e.to.x][e.to.y] |= direction(e.to, e.from);
                            updateMap({
                                x: e.from.x,
                                y: e.from.y,
                                data: self.data[e.from.x][e.from.y]
                            });
                            updateMap({
                                x: e.to.x,
                                y: e.to.y,
                                data: self.data[e.to.x][e.to.y]
                            });
                        }
                    }
                    if(edgeList.length > 0) {
                        setTimeout(process, 10);
                    }
                    else {
                        postMessage({
                            type: 'done'
                        });
                    }
                }
            }
            setTimeout(process, 0);
        }
    };
    return self;
}
