function paint(ctx, map, delay) {
    if(delay) {
        this.delay = delay;
    } else {
        this.delay = 1000 / 30;
    }
    
    var paintCell = function(x, y) {
        if(map[x][y] & 2 > 0) {
            ctx.beginPath();
            ctx.moveTo(x * 2 + 1, y * 2);
            ctx.lineTo(x * 2 + 1, y * 2 + 1);
            ctx.stroke();
        }
    }
    var render = function() {
        for(var i = 0; i < 400; i ++ ) {
            for(var j = 0; j < 300; j ++ ) {
                paintCell(i, j);
            }
        }
    }
    setInterval(render, this.delay)
}
