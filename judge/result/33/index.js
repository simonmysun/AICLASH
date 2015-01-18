var gnomeLastDir = [0, 0, 0];
var ifFirstMove = true;
var amIplayer1 = false;
var startFromHeight = true;
var buffAvailable = true;
var ourMap = [];
var ourVisited = [];
var enemyVisited = [];
var width = 0, height = 0;
var buffX = 0, buffY = 0;
var oX = 0, oY = 0;
var finalX = 0, finalY = 0;
var backDir = [0, 4, 8, 0, 1, 0, 0, 0, 2];
var gnome0x = 0, gnome0y = 0, gnome1x = 0, gnome1y = 0, gnome2x = 0, gnome2y = 0;

var sum = 0;
function initOurInfo(game) {
    'use strict';
    var i = 0, j = 0;
    width = game.width;
    height = game.height;
    if (gnome0x === 0) {
        amIplayer1 = true;
        finalX = width - 1;
        finalY = height - 1;
    } else {
        oX = width - 1;
        oY = height - 1;
    }
    if (height > width || (height === width && Math.random() > 0.5)) {
        startFromHeight = false;
    }
    //确定药水位置
    if (amIplayer1 && startFromHeight) {
        buffY = height - 1;
    } else if (amIplayer1 && !startFromHeight) {
        buffX = width - 1;
    } else if (!amIplayer1 && startFromHeight) {
        buffX = width - 1;
    } else {
        buffY = height - 1;
    }
    for (i = 0; i < width; i = i + 1) {
        ourMap[i] = [];
        ourVisited[i] = [];
        enemyVisited[i] = [];
        for (j = 0; j < height; j = j + 1) {
            ourMap[i][j] = 16;
            ourVisited[i][j] = [0, 0, 0];
            enemyVisited[i][j] = 0;
        }
    }
}

function updateOurMap(game) {
    'use strict';
    var i = 0, x = 0, y = 0, vision = 0, j = 0, k = 0;
    for (i = 0; i < 3; i = i + 1) {
        x = game.gnomes[i].x;
        y = game.gnomes[i].y;
        vision = game.gnomes[i].vision;
        for (j = x - vision; j <= x + vision; j = j + 1) {
            for (k = y - vision; k <= y + vision; k = k + 1) {
                if (Math.abs(j - x) + Math.abs(k - y) <= vision) {
                    if (checkXY(j, k)) {
                        if (ourMap[j][k] === 16) {
                            ourMap[j][k] = game.map.data[j][k];
                        }
                        enemyVisited[j][k] = game.map.visited[j][k];
                    }
                }
            }
        }
    }
}

function blockDir(x, y, dir) {
    ourMap[x][y] = ourMap[x][y] & (15 - dir);
}

function checkDir(x, y, dir) {
    return (ourMap[x][y] & dir) > 0;
}

function checkXY(x, y) {
    return (x >= 0) && (x < width) && (y >= 0) && (y < height);
}

function nextRoad(x, y, dir) {
    var dx = x, dy = y;
    switch (dir) {
    case 1:
        dy = y - 1;
        break;
    case 2:
        dx = x + 1;
        break;
    case 4:
        dy = y + 1;
        break;
    case 8:
        dx = x - 1;
        break;
    default:
        break;
    }
    return [dx, dy];
}

function hamitonOnlyDis(x, y, X, Y, step) {
    return Math.abs(X - x) + Math.abs(Y - y);
}

function hamitonDoubleDis(x, y, X, Y, step) {
    return (Math.abs(X - x) + Math.abs(Y - y)) * 2 + step;
}

function findShortRoadToDes(gnome, scheme, desX, desY, road, game) { 
    var minStep = (width + height) << 4, nearestPoint = 0; 
    var dis = 0, nxy = [], ourWeight = 0, enemyWeight = 0; 
    for (j = road.length - 1; j >= 0; j--) { 
        if (road[j].dir[gnome] === 0) { 
            continue; 
        } 
        if (scheme === 0) { 
            dis = hamitonOnlyDis(desX, desY, road[j].dx, road[j].dy, road[j].minStep[gnome]) * 2; 
        } 
        if (scheme === 2) { 
            dis = hamitonDoubleDis(desX, desY, road[j].dx, road[j].dy, road[j].minStep[gnome]) * 2; 
        } 
        nxy = nextRoad(game.gnomes[gnome].x, game.gnomes[gnome].y, road[j].dir[gnome]); 
        dis = dis + ourVisited[nxy[0]][nxy[1]][gnome] * 50; 
        if (enemyVisited[nxy[0]][nxy[1]] > 0) { 
            dis = dis / 2; 
        } 
        nxy = nextRoad(road[j].dx, road[j].dy, backDir[road[j].from]); 
        if (enemyVisited[nxy[0]][nxy[1]] > 0) { 
            dis = dis / 2; 
        } 
        if (dis < minStep) { 
            minStep = dis; 
            nearestPoint = j; 
        } 
    } 
    return road[nearestPoint].dir[gnome]; 
}

function findAllRoad() {
    var result = new Array(0);
    var road = {
        dx : oX,
        dy : oY,
        from : 0,
        minStep : [0, 0, 0],
        dir : [0, 0, 0]
    }, newRoad = {
        dx : 0,
        dy : 0,
        from : 0,
        minStep : [0, 0, 0],
        dir : [0, 0, 0]
    };
    var queue = new Array(road), visited = [], i = 0, j = 0, nxy = [], newDir = 1;
    for (i = 0; i < width; i = i + 1) {
        visited[i] = [];
        for (j = 0; j < height; j = j + 1) {
            visited[i][j] = false;
        }
    }
    visited[oX][oY] = true;
    while(queue.length !== 0) {
        road = queue.shift();
        if (ourMap[road.dx][road.dy] === 16) {
            result.push(road);
            continue;
        }
        if (buffAvailable && road.dx === buffX && road.dy === buffY) {
            result.push(road);
            continue;
        }
        if (amIplayer1 && road.dx === width - 1 && road.dy === height - 1) {
            result.push(road);
            continue;
        }
        if (!amIplayer1 && road.dx === 0 && road.dy === 0) {
            result.push(road);
            continue;
        }

        newDir = 1;
        for(i = 0; i < 4; i ++ ) {
            if((ourMap[road.dx][road.dy] & newDir) === 0 || (newDir + road.from) % 5 === 0) {
                newDir <<= 1;
                continue;
            }
            nxy = nextRoad(road.dx, road.dy, newDir);
            newRoad = {
                dx : nxy[0],
                dy : nxy[1],
                from : newDir,
                minStep : [0, 0, 0],
                dir : [0, 0, 0]
            };
            if (!checkXY(newRoad.dx, newRoad.dy)) {
                newDir <<= 1;
                continue;
            }
            if (visited[newRoad.dx][newRoad.dy]) {
                newDir <<= 1;
                continue;
            }
            visited[newRoad.dx][newRoad.dy] = true;
            queue.push(newRoad);
            newDir <<= 1;
        }
    }
    return result;
}

function findDeadEnd(x, y, dir) {
    var road = {
        dx : x,
        dy : y,
        from : dir
    }, newRoad = {
        dx : 0,
        dy : 0,
        from : 0
    }, queue = new Array(road), visited = new Array(road), dup = false, i = 0, j = 0, nxy = [], newDir = 1;
    while(queue.length !== 0) {
        road = queue.shift();
        if (ourMap[road.dx][road.dy] === 16) {
            return false;
        }
        if (buffAvailable && road.dx === buffX && road.dy === buffY) {
            return false;
        }
        if (road.dx === width - 1 && road.dy === height - 1) {
            return false;
        }
        if (road.dx === 0 && road.dy === 0) {
            return false;
        }

        newDir = 1;
        for(i = 0; i < 4; i ++ ) {
            if((ourMap[road.dx][road.dy] & newDir) === 0 || (newDir + road.from) % 5 === 0) {
                newDir <<= 1;
                continue;
            }
            nxy = nextRoad(road.dx, road.dy, newDir);
            newRoad = {
                dx : nxy[0],
                dy : nxy[1],
                from : newDir
            };
            if (!checkXY(newRoad.dx, newRoad.dy)) {
                newDir <<= 1;
                continue;
            }
            dup = false;
            for (j = visited.length - 1; j >= 0; j--) {
                if (visited[j].dx === newRoad.dx && visited[j].dy === newRoad.dy) {
                    dup = true;
                    break;
                }
            }
            if (dup) {
                newDir <<= 1;
                continue;
            }
            queue.push(newRoad);
            visited.push(newRoad);
            newDir <<= 1;
        }
    }
    return true;
}
//不能走的屏蔽，可以走但不是最优的选择走
//深搜屏蔽死分支的入口
function cutOurMap() {
    var road = {
        dx : oX,
        dy : oY,
        from : 0
    }, newRoad = {
        dx : 0,
        dy : 0,
        from : 0
    }, queue = new Array(road), visited = [], i = 0, j = 0, k = 0, nxy = [], newDir = 1;
    for (i = 0; i < width; i = i + 1) {
        visited[i] = [];
        for (j = 0; j < height; j = j + 1) {
            visited[i][j] = false;
        }
    }
    visited[oX][oY] = true;
    while(queue.length !== 0) {
        road = queue.shift();
        if (ourMap[road.dx][road.dy] === 16) {
            continue;
        }
        if ((road.dx !== oX && road.dy !== oY) && (ourMap[road.dx][road.dy] === 1 || ourMap[road.dx][road.dy] === 2 || ourMap[road.dx][road.dy] === 4 || ourMap[road.dx][road.dy] === 8)) {
            continue;
        }
        if (buffAvailable && road.dx === buffX && road.dy === buffY) {
            continue;
        }
        if (road.dx === finalX && road.dy === finalY) {
            continue;
        }
        if (ourMap[road.dx][road.dy] === 14 || ourMap[road.dx][road.dy] === 13 || ourMap[road.dx][road.dy] === 11 || ourMap[road.dx][road.dy] === 7 || ourMap[road.dx][road.dy] === 15) {
            dir = 1;
            for (k = 0; k < 4; k++) {
                if ((dir + road.from) % 5 === 0) {
                    dir <<= 1;
                    continue;
                }
                if (!checkDir(road.dx, road.dy, dir)) {
                    //方向不可行
                    dir <<= 1;
                    continue;
                }
                nxy = nextRoad(road.dx, road.dy, dir);
                if (!checkXY(nxy[0], nxy[1])) {
                    dir <<= 1;
                    continue;
                }
                if (findDeadEnd(nxy[0], nxy[1], dir)) {
                    ourMap[road.dx][road.dy] = ourMap[road.dx][road.dy] & (15 - dir);
                }
                dir <<= 1;
            }
        }

        newDir = 1;
        for(i = 0; i < 4; i ++ ) {
            if((ourMap[road.dx][road.dy] & newDir) === 0 || (newDir + road.from) % 5 === 0) {
                newDir <<= 1;
                continue;
            }
            nxy = nextRoad(road.dx, road.dy, newDir);
            newRoad = {
                dx : nxy[0],
                dy : nxy[1],
                from : newDir
            };
            if (!checkXY(newRoad.dx, newRoad.dy)) {
                newDir <<= 1;
                continue;
            }
            if (visited[newRoad.dx][newRoad.dy]) {
                newDir <<= 1;
                continue;
            }
            visited[newRoad.dx][newRoad.dy] = true;
            queue.push(newRoad);
            newDir <<= 1;
        }
    }
}
//深搜标记死循环的路和屏蔽死循环入口，提醒地精自己在走死循环
function markLoopInOurMap(game) {
}
//广搜找到一只地精到达地图一个点（包括未知点、终点、药水）的最短步数与方向
function findShortcut(allRoad, game) {
    var h = 0;
    var road = {
        dx : 0,
        dy : 0,
        step : 0,
        from : 0,
        oDir : 0
    }, newRoad = {
        dx : 0,
        dy : 0,
        step : 0,
        from : 0,
        oDir : 0
    }, queue = new Array(0);
    var di = 0, j = 0, nxy = [], newDir = 1, visited = [], count = 0;
    for (h = 0; h < 3; h++) {
        road = {
            dx : game.gnomes[h].x,
            dy : game.gnomes[h].y,
            step : 0,
            from : 0,
            oDir : 0
        };
        count = 0;
        for (i = 0; i < width; i = i + 1) {
            visited[i] = [];
            for (j = 0; j < height; j = j + 1) {
                visited[i][j] = false;
            }
        }
        visited[road.dx][road.dy] = true;
        queue.length = 0;
        queue.push(road);
        while(queue.length !== 0) {
            road = queue.shift();
            for (i = allRoad.length - 1; i >= 0; i--) {
                if (road.dx === allRoad[i].dx && road.dy === allRoad[i].dy) {
                    allRoad[i].minStep[h] = road.step;
                    allRoad[i].dir[h] = road.oDir;
                    //////console.log(allRoad[i]);
                    //////console.log(road);
                    count++;
                    if (count === allRoad.length) {
                        break;
                    }
                }
            }
            if (count === allRoad.length) {
                break;
            }
            newDir = 1;
            for(i = 0; i < 4; i ++ ) {
                if((ourMap[road.dx][road.dy] & newDir) === 0) {
                    newDir <<= 1;
                    continue;
                }
                nxy = nextRoad(road.dx, road.dy, newDir);
                newRoad = {
                    dx : nxy[0],
                    dy : nxy[1],
                    step : road.step + 1,
                    from : newDir,
                    oDir : 0
                };
                if (road.step === 0) {
                    newRoad.oDir = newDir;
                } else {
                    newRoad.oDir = road.oDir;
                }
                if (!checkXY(newRoad.dx, newRoad.dy)) {
                    newDir <<= 1;
                    continue;
                }
                if (visited[newRoad.dx][newRoad.dy]) {
                    newDir <<= 1;
                    continue;
                }
                visited[newRoad.dx][newRoad.dy] = true;
                queue.push(newRoad);
                newDir <<= 1;
            }
        }
    }
    return allRoad;
}

function checkBuffAvailable(game) {
    'use strict';
    if (buffAvailable) {
        var i = 0;
        //判断我方吃了药水
        for (i = 0; i < 3; i = i + 1) {
            if (game.gnomes[i].x === buffX && game.gnomes[i].y === buffY) {
                buffAvailable = false;
                break;
            }
        }
        //判断敌方吃了药水
        if (enemyVisited[buffX][buffY] > 0) {
            buffAvailable = false;
        }
    }
}

function gnome0Go(road, game) {
    return findShortRoadToDes(0, 0, finalX, finalY, road, game);
}

function gnome1Go(road, game) {
    if (amIplayer1 && gnome1x < width * 3 / 5) {
        return findShortRoadToDes(1, 2, width * 3 / 4, height / 4, road, game);
    }
    if (!amIplayer1 && gnome1x > width * 2 / 5) {
        return findShortRoadToDes(1, 2, width / 4, height * 3 / 4, road, game);
    }
    return findShortRoadToDes(1, 2, finalX, finalY, road, game);
}

function gnome2Go(road, game) {
    if (amIplayer1 && gnome2y < height * 3 / 5) {
        return findShortRoadToDes(2, 2, width / 4, height * 3 / 4, road, game);
    }
    if (!amIplayer1 && gnome2y > height * 2 / 5) {
        return findShortRoadToDes(2, 2, width * 3 / 4, height / 4, road, game);
    }
    return findShortRoadToDes(2, 2, finalX, finalY, road, game);
}

onMyTurn = function (game) {
    'use strict';
    gnome0x = game.gnomes[0].x, gnome0y = game.gnomes[0].y, gnome1x = game.gnomes[1].x, gnome1y = game.gnomes[1].y, gnome2x = game.gnomes[2].x, gnome2y = game.gnomes[2].y;
    sum++;
    if (ifFirstMove) {
        ifFirstMove = false;
        initOurInfo(game);
    }
    /*if (gnome0x === finalX && gnome0y === finalY) {
        console.log("ssss" + sum);
    }
    if (gnome1x === finalX && gnome1y === finalY) {
        console.log("ssss" + sum);
    }
    if (gnome2x === finalX && gnome2y === finalY) {
        console.log("ssss" + sum);
    }*/
    updateOurMap(game);

    checkBuffAvailable(game);

    cutOurMap();

    var road = findAllRoad();
    road = findShortcut(road, game);

    ourVisited[gnome0x][gnome0y][0]++;
    ourVisited[gnome1x][gnome1y][1]++;
    ourVisited[gnome2x][gnome2y][2]++;

    gnomeLastDir[0] = gnome0Go(road, game);
    gnomeLastDir[1] = gnome1Go(road, game);
    gnomeLastDir[2] = gnome2Go(road, game);

    return gnomeLastDir;
};