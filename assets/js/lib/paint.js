function paint(canvas, game, delay) {
    var ctx = canvas.getContext('2d');
    if(delay) {
        this.delay = delay;
    } else {
        this.delay = 1000 / 30;
    }
    var cellSize = 400 / game.width;
    var paintCell = function(x, y) {
        if((game.map[x][y].data & 1) > 0) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.lineTo(x * cellSize * 2 + cellSize / 2, (y - 1) * cellSize * 2 + cellSize / 2);
            ctx.stroke();
        }
        if((game.map[x][y].data & 2) > 0) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.lineTo((x + 1) * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.stroke();
        }
        if((game.map[x][y].data & 4) > 0) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.lineTo(x * cellSize * 2 + cellSize / 2, (y + 1) * cellSize * 2 + cellSize / 2);
            ctx.stroke();
        }
        if((game.map[x][y].data & 8) > 0) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.lineTo((x - 1) * cellSize * 2 + cellSize / 2, y * cellSize * 2 + cellSize / 2);
            ctx.stroke();
        }
    }
    var renderWall = function() {
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
    }
    setInterval(renderWall, this.delay * 10);
    var renderCellQueue = [];
    var renderCell = function(cell, status) {
        
    };
}
