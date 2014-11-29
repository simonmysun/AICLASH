function Game() {
    this.map = [];
    for(var i = 0; i < 400; i ++ ) {
        this.map[i] = [];
        for(var j = 0; j < 300; j ++ ) {
            this.map[i][j] = {
                data: 9,
                visited: [0, 0]
            }
        }
    }
    return 0;
}
