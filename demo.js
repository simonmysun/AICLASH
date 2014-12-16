var gnomeDir = [];
var ifFirstMove = true;

function turnLeft(dir) {
    dir <<= 1;
    if(dir === 0) {
        dir = 8;
    }
}

function turnRight(dir) {
    dir >>= 1;
    if(dir === 8) {
        dir = 1;
    }
}

function lookAt(src, dir) {
    
}

function check(loc) {
    
}

onMyTurn = function() {
    if(ifFirstMove) {
        ifFirstMove = false;
        if(game.gnomes[0].x == 1) {
            gnomeDir[0] = 2;
            gnomeDir[1] = 4;
        } else {
            gnomeDir[0] = 1;
            gnomeDir[1] = 8;
        }
    }
    var gnome
}
