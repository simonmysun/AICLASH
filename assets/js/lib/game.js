function Game() {
    this.map = [];
    this.width = 200;
    this.height = 150;
    for(var i = 0; i < this.width; i ++ ) {
        this.map[i] = [];
        for(var j = 0; j < this.height; j ++ ) {
            this.map[i][j] = {
                data: 2,
                visited: [0, 0]
            }
        }
    }
    return 0;
}
