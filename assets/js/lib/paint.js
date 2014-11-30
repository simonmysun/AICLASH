function Painter(canvas, game, delay) {
    var self = this;
    var ctx = canvas.getContext('2d');
    self.delay = delay || (1000 / 30);
    var cellSize = 400 / game.width;
    var paintCell = function(x, y) {
        ctx.fillStyle="#17355e";
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
    var renderAll = function() {
        console.time('render');
        ctx.fillStyle="#17355e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = cellSize;
        ctx.strokeStyle = '#fffbeb';
        ctx.lineCap = 'square';
        for(var i = 0; i < game.width; i ++ ) {
            for(var j = 0; j < game.height; j ++ ) {
                paintCell(i, j);
            }
        }
        console.timeEnd('render');
    };
    renderAll();
    var paintQueue = [];
    self.pushPaintEvent = function(e) {
        paintQueue.push(e);
    };
    setInterval(function() {
        var k = 1000;
        while(paintQueue.length > 0 && k > 0) {
            var c = paintQueue.pop();
            paintCell(c.x, c.y);
            k -- ;
        }
    }, self.delay);
}
