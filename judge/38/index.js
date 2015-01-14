var gnomeDir = [];
var ifFirstMove = true;
var mm;
var ex,ey;
var width,height;

var selfmap = new Array();
for(var i = 0;i < 100;i++){
    selfmap[i] = new Array();
    for(var j = 0;j < 75;j++){
        selfmap[i][j] = -1;
    }
}

//方向数组
var fdir = new Array();
fdir[0] = [-1,0];
fdir[1] = [1, 0];
fdir[2] = [0, 1];
fdir[3] = [0,-1];

function turnLeft(dir) {
    dir >>= 1;
    if(dir === 0) {
        dir = 8;
    }
    return dir;
}
function getE(game){
    width = game.width;
    height = game.height;
    if(game.gnomes[0].x === 0 && game.gnomes[0].y === 0){
        ex = game.width - 1;
        ey = game.height - 1;
    }else{
        ex = 0;
        ey = 0;
    }
}
function ex_point(x,y,game){
    if(x == ex && y == ey){
        return false;
    }
    if(x == width - 1 && y == 0){
        var c = game.map.visited[x][y];
        if(c > 0){
            return true;
        }else {
            return false;
        }
    }
    if(x == 0 &&  y == height - 1){
       var c = game.map.visited[x][y];
        if(c > 0){
            return true;
        }else {
            return false;
        }
    }
    return true;
}

function turnRight(dir) {
    dir <<= 1;
    if(dir > 8) {
        dir = 1;
    }
    return dir;
}

function check(game, src, dir) {
    var gdir = change_dir_gdir(dir);

    if((game.map.data[src.x][src.y] & dir) > 0) {
        if(selfmap[src.x + gdir[0]][src.y + gdir[1]] == 1){
            return false;
        }
        return true;
    } else {
        return false;
    }}

function check_range(x, y){
    if(x < 0 || x >= width || y < 0 || y >= height){
        return false;
    }
    return true;
}
function check_link(game, x, y, dir){
    if((game.map.data[x][y] & dir) > 0) {
        return true;
    } else {
        return false;
    }
}

function change_dir_gdir(dir){
    if(dir == 1){
        return [0, -1];
    }else if(dir == 2){
        return [1, 0];
    }else if(dir == 4){
        return [0, 1];
    }else if(dir == 8){
        return [-1, 0];
    }
    else{
    }
}
function abs(x){
    return Math.abs(x);
}

function blind(game,point){
    var gx = game.gnomes[point].x;
    var gy = game.gnomes[point].y;
    var vi = game.gnomes[point].vision;
    var gcount = 0;
    var virDir = 1;
    var gvirDir = [0,0];
    var gcurDir = [0,0];
    var cur = {
        'x':0,
        'y':0
    };
    var ff;

    for(var i = -vi;i <= vi;i++){
        for(var j = -vi;j <= vi;j++){
            ff = 1;
            for(var k = 0;k < 3;k++){
                if(gx + i == game.gnomes[k].x && gy + j == game.gnomes[k].y){
                    ff = 0;
                }
            }
            if(abs(i) + abs(j) <= vi && check_range(gx + i,gy + j) && ff && selfmap[gx + i][gy + j] != 1 && ex_point(gx + i,gy + j,game)){
                gcount = 0;
                virDir = 1;
                for(var k = 0;k < 4;k++){
                    gvirDir = change_dir_gdir(virDir);
                    if(!check_link(game, gx + i, gy + j,virDir) || selfmap[gx + i + gvirDir[0]][gy + j + gvirDir[1]] == 1){
                        gcount++;
                    }else{
                        gcurDir[0] = gvirDir[0];
                        gcurDir[1] = gvirDir[1];
                        cur.x = gx + i;
                        cur.y = gy + j;
                    }
                    virDir = turnRight(virDir);
                }
                if(gcount == 3){
                    while(gcount == 3){
                        selfmap[cur.x][cur.y] = 1;
                        gcount = 0;
                        virDir = 1;
                        cur.x += gcurDir[0];
                        cur.y += gcurDir[1];
                        if(abs(cur.x - gx) + abs(cur.y - gy) > vi){
                            break;
                        }
                        ff = 1;
                        for(var k = 0;k < 3;k++){
                            if(cur.x == game.gnomes[k].x && cur.y == game.gnomes[k].y){
                                ff = 0;
                            }
                        }
                        if(ff === 0){
                            break;
                        }
                        for(var k = 0;k < 4;k++){
                            gvirDir = change_dir_gdir(virDir);
                            if(!check_link(game, cur.x, cur.y,virDir) || selfmap[cur.x + gvirDir[0]][cur.y + gvirDir[1]] == 1){
                                gcount++;
                            }else{
                                gcurDir[0] = gvirDir[0];
                                gcurDir[1] = gvirDir[1];
                            }
                            virDir = turnRight(virDir);
                        }
                    }
                }
            }
        }
    }
}

function try_E(game, point){
    var q = [];
    var gx = game.gnomes[point].x;
    var gy = game.gnomes[point].y;
    var vi = game.gnomes[point].vision;
    var virDir = 1;
    var gvirDir = [0, 0];
    var maxlen = 80000;
    var cur = {
        'x':ex,
        'y':ey
    }
    var next = {
        'x':0,
        'y':0,
    }
    
    var virmap = new Array();
    for(var i = 0;i < width;i++){
        virmap[i] = new Array();    
        for(var j = 0;j < height;j++){
            virmap[i][j] = maxlen;
        }
    }
    
    virmap[ex][ey] = 0;
    q.push(cur);
    
    while(q.length != 0){
        cur = q.shift();
        if(cur.x == gx && cur.y == gy){
            break;
        }
        virDir = 1;
        for(var k = 0;k < 4;k++){
            gvirDir = change_dir_gdir(virDir);
            if(abs(cur.x + gvirDir[0] - gx) + abs(cur.y + gvirDir[1] - gy) <= vi){
                if(check_link(game,cur.x,cur.y,virDir)){
                    if(selfmap[cur.x + gvirDir[0]][cur.y + gvirDir[1]] != 1){
                        if(virmap[cur.x + gvirDir[0]][cur.y + gvirDir[1]] > virmap[cur.x][cur.y] + 1){
                            virmap[cur.x + gvirDir[0]][cur.y + gvirDir[1]] = virmap[cur.x][cur.y] + 1;
                            
                            next.x = cur.x + gvirDir[0];
                            next.y = cur.y + gvirDir[1];
                            q.push(next);
                        }
                    }
                }
            }
            virDir = turnRight(virDir);
        }
    }
    if(virmap[gx][gy] == maxlen){
        return -1;
    }else{
        virDir = 1;
        var cor = virDir;
        var curlen = virmap[gx][gy];

        for(var k = 0;k < 4;k++){
            gvirDir = change_dir_gdir(virDir);
            if(check_range(gx + gvirDir[0],gy + gvirDir[1]) && virmap[gx + gvirDir[0]][gy + gvirDir[1]] < curlen){
                curlen = virmap[gx + gvirDir[0]][gy + gvirDir[1]];
                cor = virDir;
            }
            virDir = turnRight(virDir);
        }
        return cor;
    }
}

onMyTurn = function(game) {
    //第一次
    if(ifFirstMove) {
        getE(game);
        ifFirstMove = false;
        mm = 0;
        if(game.gnomes[0].x === 0) {
            gnomeDir[0] = 2;
            gnomeDir[1] = 4;
            gnomeDir[0] = 2;
        } else {
            gnomeDir[0] = 1;
            gnomeDir[1] = 8;
            gnomeDir[0] = 1;
        }
    }

    for(var k = 0;k < 3;k++){
        blind(game,k);
    }

    var action = [-1,-1,-1];
    
    for(var k = 0;k < 3;k++){
        if(abs(game.gnomes[k].x - ex) + abs(game.gnomes[k].y - ey) <= game.gnomes[k].vision){
            action[k] = try_E(game,k);
        }
    }
    
    if(action[0] == -1){
        gnomeDir[0] = turnRight(gnomeDir[0]);
        while(check(game, game.gnomes[0], gnomeDir[0]) !== true) {
            gnomeDir[0] = turnLeft(gnomeDir[0]);
        }
        action[0] = gnomeDir[0];
    }
    
    if(action[1] == -1){
        gnomeDir[1] = turnLeft(gnomeDir[1]);
        while(check(game, game.gnomes[1], gnomeDir[1]) !== true) {
            gnomeDir[1] = turnRight(gnomeDir[1]);
        }
        action[1] = gnomeDir[1];
    }
    
    if(action[2] == -1){
        if(mm < 400){
            action[2] = action[0];
        }if(mm == 400){
            gnomeDir[2] = turnLeft(gnomeDir[2]);
            while(check(game, game.gnomes[2], gnomeDir[2]) !== true) {
                gnomeDir[2] = turnRight(gnomeDir[2]);
            }
            action[2] = gnomeDir[2]; 
        }else{
            gnomeDir[2] = turnRight(gnomeDir[2]);
            while(check(game, game.gnomes[2], gnomeDir[2]) !== true) {
                gnomeDir[2] = turnLeft(gnomeDir[2]);
            }
            action[2] = gnomeDir[2];
        }
    }
    
    gnomeDir[0] = action[0];
    gnomeDir[1] = action[1];
    gnomeDir[2] = action[2];
    
    mm++;
    return action;
}
