
var ifFirstMove = true;
var gnomeDir = [];
var myMap = [];
var visited = [];
var width = 0, height = 0;
var finalX = 0, finalY = 0;
var oneStep = [];
var dis = [];
var inqueue = [];
var factor = [];
var optTarget = [];
var vistTarget = [];

function init() {
    var i = 0, j = 0, k = 0;
    for(i = 0; i < 3; i++) {
        factor[i] = [];
        factor[i][0] = 0;
        factor[i][1] = 0;

        optTarget[i] = [];
        optTarget[i][0] = 0;
        optTarget[i][1] = 0;
    }
    factor[0][0] = 0.35;
    factor[0][1] = 0.8;
    factor[1][0] = 0.25;
    factor[1][1] = 0.9;
    factor[2][0] = 0.15;
    factor[2][1] = 0.95;

    for(i = 0; i < 4; i++) {
        oneStep[i] = [];
        oneStep[i][0] = 0;
        oneStep[i][1] = 0;
    }
    oneStep[0][1] = -1;
    oneStep[1][0] = 1;
    oneStep[2][1] = 1;
    oneStep[3][0] = -1;
    for(k = 0; k < 3; k++) {
        vistTarget[k] = [];
        for(i = 0; i < width; i++) {
            myMap[i] = [];
            gnomeDir[i] = [];
            dis[i] = [];
            inqueue[i] = [];
            vistTarget[k][i] = [];
            visited[i] = [];
            for(j = 0; j < height; j++) {
                myMap[i][j] = -1;
                gnomeDir[i][j] = -1;
                dis[i][j] = -1;
                inqueue[i][j] = true;
                vistTarget[k][i][j] = false;
                visited[i][j] = -1;
            }
        }
    }
}

function turnLeft(dir) {
    dir--;
    if(dir < 0) dir += 4;
    return dir;
}

function turnRight(dir) {
    dir++;
    if(dir > 3) dir -= 4;
    return dir;
}

function min(x, y) {
    if (x < y)
        return x;
    return y;
}
function max(x, y) {
    if (x > y)
        return x;
    return y;
}
function myabs(x) {
    if (x < 0)
        x = -x;
    return x;
}

function manhattonDis(x, y, xx, yy){
    return myabs(x - xx) + myabs(y - yy);
}

function update(game, gnome) {
    var vision = gnome.vision;
    var x = gnome.x;
    var y = gnome.y;
    var i = 0, j = 0;
    for(i = max(0, x - vision); i <= min(width - 1, x + vision); i++) {
        for(j = max(0, y - vision); j <= min(height - 1, y + vision); j++) {
            if(manhattonDis(i, j, x, y) <= vision) {
                myMap[i][j] = game.map.data[i][j];
                visited[i][j] = game.map.visited[i][j];
            }
        }
    }
}

function check(x, y, dir) {
    if((myMap[x][y] & (1<<dir)) > 0) {
        return true;
    }
    return false;
}

function calScore(cur, id){
    return factor[id][0] * cur.dis + factor[id][1] * manhattonDis(cur.x, cur.y, finalX, finalY);
}

function solve(gnome, id){
    var i = 0, j = 0, k = 0;
    for(i = 0; i < width; i++) {
        for(j = 0; j < height; j++) {
            dis[i][j] = -1;
            inqueue[i][j] = false;
        }
    }
    var queue = [];
    queue.push({x:gnome.x, y:gnome.y, dis:0});
    inqueue[gnome.x][gnome.y] = true;
    dis[gnome.x][gnome.y] = 0;
    var cur = gnome;
    var s = 0, t = 0;
    var cnt = 0;
    var minScore = 100000, targetX = -1, targetY = -1, tmp = 0;
    var flag = false;
    var markX = -1, markY = -1;

    while(queue.length){
        cur = queue.shift();
        for(i = 0; i < 4; i++) {
            if(!check(cur.x, cur.y, i)) continue;
            s = cur.x + oneStep[i][0];
            t = cur.y + oneStep[i][1];
            if(inqueue[s][t])  continue ;
            if(myMap[s][t] === -1) {
                tmp = calScore(cur, id);
                if(tmp < minScore) {
                    flag = false;
                    for(k = 0; k < id; k++){
                        if(vistTarget[k][cur.x][cur.y] === true) {
                            markX = cur.x;
                            markY = cur.y;
                            flag = true;
                            break ;
                        }
                    }
                    if(flag) continue;
                    minScore = tmp;
                    targetX = cur.x;
                    targetY = cur.y;
                }
                continue ;
            }
            queue.push({x:s, y:t, dis:cur.dis+1});
            inqueue[s][t] = true;
            dis[s][t] = cur.dis + 1;
            if(s === finalX && t === finalY) {
                targetX = finalX;
                targetY = finalY;
                flag = true;
                break ;
            }
        }
        if(flag)  break ;
    }
    if(targetX === -1 && targetY === -1 && markX !== -1 && markY !== -1) {
        targetX = markX;
        targetY = markY;
    }
    vistTarget[id][targetX][targetY] = true;
    var dir = -1;
    while(targetX !== gnome.x || targetY !== gnome.y) {
        for(i = 0; i < 4; i++) {
            if(!check(targetX, targetY, i)) continue ;
            s = targetX + oneStep[i][0];
            t = targetY + oneStep[i][1];
            if(dis[s][t] + 1 === dis[targetX][targetY]) {
                targetX = s;
                targetY = t;
                dir = i;
                break ;
            }
        }
    }
    if(dir === 0 || dir === 2) dir = 2 - dir;
    else  dir = 4 - dir;

    return (1<<dir);
}


//var steps = 0;
//var flag = true;
onMyTurn = function(game) {
    if(ifFirstMove) {
        ifFirstMove = false;
        width = game.width;
        height = game.height;
        init();
        if(game.gnomes[0].x === 0) {
            finalX = width - 1;
            finalY = height - 1;
        } else {
            finalX = 0;
            finalY = 0;
        }
    }
    var i = 0;
    /*if(flag) {
        for(i = 0; i < 3; i++) {
            if(game.gnomes[i].x === finalX && game.gnomes[i].y === finalY) {
                console.log("p1----gnomes", i, steps);
                flag = false;
            }
        }
    }
    steps++;
    */
    for(i = 0; i < 3; i++) {
        update(game, game.gnomes[i]);
    }
    var action = [];
    for(i = 0; i < 3; i++) {
        action[i] = solve(game.gnomes[i], i);
    }
    return action;
}
