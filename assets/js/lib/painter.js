(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}()); // from http://www.zhangxinxu.com/wordpress/2013/09/css3-animation-requestanimationframe-tween-%E5%8A%A8%E7%94%BB%E7%AE%97%E6%B3%95/

function Painter(canvas, game, delay) {
    var self = this;
    var paintQueue = [];
    var ctx = canvas.getContext('2d');
    var wallColor = '#272822';
    var cellColor = '#fff';
    self.alphaInBlend = 0.7;
    self.delay = delay || (1000 / 30);
    var paintCell = function(x, y) {
        var cellSize = 400 / game.width;
        ctx.lineWidth = cellSize;
        var colorR = Math.floor((Math.pow(self.alphaInBlend, game.map.visited[x][y][0]) * (Math.pow(self.alphaInBlend, game.map.visited[x][y][1]) - 1) + 1) * 255);
        var colorG = Math.floor(Math.pow(self.alphaInBlend, game.map.visited[x][y][0] + game.map.visited[x][y][1]) * 255);
        var colorB = Math.floor((Math.pow(self.alphaInBlend, game.map.visited[x][y][1]) * (Math.pow(self.alphaInBlend, game.map.visited[x][y][0]) - 1) + 1) * 255);
        ctx.strokeStyle = 'rgb(' + colorR + ', ' + colorG + ', ' + colorB + ')';
        ctx.lineCap = 'square';
        if((game.map.data[x][y] & 1) > 0) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.lineTo(x * cellSize * 2 + cellSize / 2, (y - 0.5) * cellSize * 2 + cellSize / 2);
            ctx.stroke();
        }
        if((game.map.data[x][y] & 2) > 0) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.lineTo((x + 0.5) * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.stroke();
        }
        if((game.map.data[x][y] & 4) > 0) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.lineTo(x * cellSize * 2 + cellSize / 2, (y + 0.5) * cellSize * 2 + cellSize / 2);
            ctx.stroke();
        }
        if((game.map.data[x][y] & 8) > 0) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.lineTo((x - 0.5) * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.stroke();
        }
    };
    self.renderAll = function() {
        var cellSize = 400 / game.width;
        ctx.fillStyle = wallColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = cellSize;
        ctx.strokeStyle = cellColor;
        ctx.lineCap = 'square';
        for(var i = 0; i < game.width; i ++ ) {
            for(var j = 0; j < game.height; j ++ ) {
                paintQueue.push({
                    x: i,
                    y: j
                });
            }
        }
    };
    self.renderAll();
    self.pushPaintEvent = function(e) {
        paintQueue.push(e);
    };
    self.clearPaintQueue = function() {
        paintQueue = [];
    };
    var render = function() {
        var k = 1000;
        while(paintQueue.length > 0 && k > 0) {
            var c = paintQueue.pop();
            paintCell(c.x, c.y);
            k -- ;
        }
        requestAnimationFrame(render);
    };
    render();
}
