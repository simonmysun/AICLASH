//'rgba(' + Math.min(game.map.visited[x][y][0] * 255, 255) + ', 0, ' + Math.min(game.map.visited[x][y][1] * 255, 255) + ', 0.5)'
function Painter(canvas, game, delay) {
    var self = this;
    var paintQueue = [];
    var ctx = canvas.getContext('2d');
    var wallColor = '#272822';
    var cellColor = '#fffbeb';
    self.delay = delay || (1000 / 30);
    var paintCell = function(x, y) {
        var cellSize = 400 / game.width;
        ctx.fillStyle = wallColor;
        ctx.lineWidth = cellSize;
        ctx.strokeStyle = cellColor;
        ctx.lineCap = 'square';
        ctx.fillRect((x - 1) * cellSize * 2 + cellSize, (y - 1) * cellSize * 2 + cellSize, 6, 6);
        if((game.map.data[x][y] & 1) > 0) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.lineTo(x * cellSize * 2 + cellSize / 2, (y - 1) * cellSize * 2 + cellSize / 2);
            ctx.stroke();
        }
        if((game.map.data[x][y] & 2) > 0) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.lineTo((x + 1) * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.stroke();
        }
        if((game.map.data[x][y] & 4) > 0) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.lineTo(x * cellSize * 2 + cellSize / 2, (y + 1) * cellSize * 2 + cellSize / 2);
            ctx.stroke();
        }
        if((game.map.data[x][y] & 8) > 0) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.lineTo((x - 1) * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
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
        stats.end();
        stats.begin();
        var k = 1000;
        while(paintQueue.length > 0 && k > 0) {
            var c = paintQueue.pop();
            paintCell(c.x, c.y);
            k -- ;
        }
        setTimeout(render, self.delay);
    };
    render();
}
