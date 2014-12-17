var gnomeDir = [];
var ifFirstMove = true;

function turnLeft(dir) {
    dir >>= 1;
    if(dir === 0) {
        dir = 8;
    }
    return dir;
}

function turnRight(dir) {
    dir <<= 1;
    if(dir > 8) {
        dir = 1;
    }
    return dir;
}

function check(game, src, dir) {
    if((game.map.data[src.x][src.y] & dir) > 0) {
        return true;
    } else {
        return false;
    }
}

onMyTurn = function(game) {
    if(ifFirstMove) {
        ifFirstMove = false;
        if(game.gnomes[0].x === 0) {
            gnomeDir[0] = 2;
            gnomeDir[1] = 4;
        } else {
            gnomeDir[0] = 1;
            gnomeDir[1] = 8;
        }
    }
    var action = [];
    gnomeDir[0] = turnRight(gnomeDir[0]);
    while(check(game, game.gnomes[0], gnomeDir[0]) !== true) {
        gnomeDir[0] = turnLeft(gnomeDir[0]);
    }
    action[0] = gnomeDir[0];
    gnomeDir[1] = turnLeft(gnomeDir[1]);
    while(check(game, game.gnomes[1], gnomeDir[1]) !== true) {
        gnomeDir[1] = turnRight(gnomeDir[1]);
    }
    action[1] = gnomeDir[1];
    var availableActions = [];
    for(var i = 1; i < 16; i *= 2) {
        if(check(game, game.gnomes[2], i) === true) {
            availableActions.push(i);
        }
    }
    action[2] = availableActions[Math.floor(Math.random() * availableActions.length)];
    return action;
};
