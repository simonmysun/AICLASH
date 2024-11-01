
//?\u00A8\u00A8?\u00A1\u00A7\u00A1\u00E3?
var mymap = [];
for (var jh = 0; jh <= 200; jh++) {
    mymap[jh] = [];
}

var ff = [];
ff[0] = [];
ff[1] = [];
var inflag = [];
var gnomeDir = [];
var ifFirstMove = true;

function turnLeft(dir) {
    dir >>= 1;
    if (dir === 0) {
        dir = 8;
    }
    return dir;
}

function turnRight(dir) {
    dir <<= 1;
    if (dir > 8) {
        dir = 1;
    }
    return dir;
}

function check(game, src, dir) {
    if ((game.map.data[src.x][src.y] & dir) > 0) {
        var tx, ty;
        tx = src.x + ff[0][dir];
        ty = src.y + ff[1][dir];
        if (game.map.visited[src.x][src.y] > 0 && game.map.visited[tx][ty] == 0)
            return false;

        if (mymap[tx][ty] == 99) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return false;
    }
}
var move = [];
for (var t = 0; t < 5; t++)
    move[t] = [];


var smove = [];
for (var t = 0; t < 5; t++)
    smove[t] = [];

var bbq = [];
bbq[0] = 1;
bbq[1] = 2;
bbq[2] = 4;
bbq[3] = 8;

function give_mymap(game) {
    //   return 0;
    var nx, ny, nsee;
    for (var kl = 0; kl < 5; kl++)
        for (var i = 0; i < 3; i++) {
            nx = game.gnomes[i].x;
            ny = game.gnomes[i].y;
            nsee = game.gnomes[i].vision;
            var hx, hy;
            for (var jx = 1; jx <= nsee; jx++) {
                for (var jy = 1; jy <= nsee; jy++) {
                    if (jx + jy <= nsee) {

                        for (var key = 0; key < 4; key++) {

                            var flag = 0;
                            hx = nx + move[key][0] * jx;
                            hy = ny + move[key][1] * jy;
                            var hux, huy;
                            if (hx >= 0 && hy >= 0 && hx < game.width && hy < game.height) {
                                if (hx == 0 && hy == 0)
                                    continue;
                                if (hx == (game.width - 1) && (hy == game.height - 1))
                                    continue;

                                for (var tt = 0; tt < 4; tt++) {
                                    hux = hx + smove[tt][0];
                                    huy = hy + smove[tt][1];
                                    if (hux >= 0 && huy >= 0) {
                                        if ((game.map.data[hx][hy] & bbq[tt]) <= 0 || mymap[hux][huy] == 99) {
                                            flag++;
                                        }
                                    }
                                    else {
                                        if ((game.map.data[hx][hy] & bbq[tt]) <= 0) {
                                            flag++;
                                        }
                                    }
                                }
                                if (flag >= 3) {
                                    if ((hx == 0 && hy == 0) || (hx == (game.width - 1) && hy == (game.height - 1))) {
                                        var ttyyuu = 1;
                                    }
                                    else {
                                        mymap[hx][hy] = 99;
                                    }
                                }

                            }

                        }

                    }

                }
            }


        }


    return 0;
}

onMyTurn = function (game) {
    if (ifFirstMove) {
        inflag[1] = 1;
        inflag[0] = 1;
        inflag[2] = 1;
        // console.log("?\u00A6\u00CC?a:",fn);

        ff[0][1] = 0;
        ff[1][1] = -1;
        ff[0][2] = 1;
        ff[1][2] = 0;
        ff[0][4] = 0;
        ff[1][4] = 1;
        ff[0][8] = -1;
        ff[1][8] = 0;

        move[0][0] = 1;
        move[0][1] = -1;
        move[1][0] = 1;
        move[1][1] = 1;
        move[2][0] = -1;
        move[2][1] = 1;
        move[3][0] = -1;
        move[3][1] = -1;

        smove[0][0] = 0;
        smove[0][1] = -1;
        smove[1][0] = 1;
        smove[1][1] = 0;
        smove[2][0] = 0;
        smove[2][1] = 1;
        smove[3][0] = -1;
        smove[3][1] = 0;

        ifFirstMove = false;
        if (game.gnomes[0].x === 0) {
            gnomeDir[0] = 2;
            gnomeDir[1] = 4;
        }
        else {
            gnomeDir[0] = 1;
            gnomeDir[1] = 8;
        }
    }

    give_mymap(game);

    var action = [];

    gnomeDir[0] = turnRight(gnomeDir[0]);
    while (check(game, game.gnomes[0], gnomeDir[0]) !== true) {
        gnomeDir[0] = turnLeft(gnomeDir[0]);
    }
    action[0] = gnomeDir[0];
    gnomeDir[1] = turnLeft(gnomeDir[1]);

    while (check(game, game.gnomes[1], gnomeDir[1]) !== true) {
        gnomeDir[1] = turnRight(gnomeDir[1]);
    }
    action[1] = gnomeDir[1];
    var availableActions = [];
    for (var i = 1; i < 16; i *= 2) {
        if (check(game, game.gnomes[2], i) === true) {
            availableActions.push(i);
        }
    }
    action[2] = availableActions[Math.floor(Math.random() * availableActions.length)];

    return action;
};
