var gnomeDir = [];
var ifFirstMove = true;
var data = [];
var visited = [];
var vision = [];
var width = 0;
var height = 0;

var gnomeAim = [];
var gnomeDis = [];
var gnomeOpt = [];
var gnomeLast = [];
var His = [];
var kill = [];
var myVis = [];
var nextAim = [];
var lazyAim = [];
var finalX = 0;
var finalY = 0;
var startX = 0;
var startY = 0;

var start = [];

var oneStep = [];

var  tiaoCan = [];
var times = [];
var planB = 0;
var lastDir = [];

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

function min(x, y){
    if (x < y)
        return x;
    return y;
}
function max(x, y){
    if (x > y)
        return x;
    return y;
}
function myabs(x){
    if (x<0)
        x = -x;
    return x;
}
function MahattnDis(posA, posB){
    return myabs(posA.x - posB.x) + myabs(posA.y - posB.y);
}


function initKill(){
}
function init(game){
    width = game.width;
    height = game.height;
    //console.log(width);
    //console.log(height);
    for (var i = 0;i<width;i++){
        data[i] = [];
        visited[i] =[];
        for (var j = 0;j<height;j++){
            data[i][j] = -1;
            visited[i][j] = -1;
        }
    }
    for (var i = 0;i<3;i++){
        start[i] = {x:-1, y:-1}
        gnomeAim[i] = {x:-1, y:-1, dir:-1};
        nextAim[i] = {x:-1, y:-1, dir:-1};
        lazyAim[i] = -1;
        gnomeDis[i] = [];
        gnomeOpt[i] = [];
        gnomeLast[i] = [];
        His[i] = [];
        for (var j = 0;j<width;j++){
            gnomeDis[i][j] = [];
            gnomeOpt[i][j] = [];
            gnomeLast[i][j] = [];
            His[i][j] = [];
            for (var k = 0;k<height;k++){
                gnomeDis[i][j][k] = -1;
                gnomeOpt[i][j][k] = -1;
                gnomeLast[i][j][k] = -1;
                His[i][j][k] = 0;
            }
        }
    }
    for (var i = 0;i<width;i++){
        kill[i] = [];
        myVis[i] = [];
        for (var j =0;j<height;j++){
            kill[i][j]= 0;
            myVis[i][j] = 0;
        }
    }

    for (var i = 0;i<4;i++){
        oneStep[i] = {x:0, y:0};
    }
    oneStep[0].y--;
    oneStep[1].x++;
    oneStep[2].y++;
    oneStep[3].x--;
    for (var i = 0;i<3;i++){
        tiaoCan[i] = [];
    //    console.log(oneStep[i]);
    }

    tiaoCan[0] = [5, 1, 0];
    tiaoCan[1] = [4.5, 1, 0];
    tiaoCan[2] = [2,1, 0];
   // for (var i = 0;i<3;i++)
        //console.log(tiaoCan[i]);
}

function scanKill(x, y, t){
    kill[x][y] = 1;
    for (var k = 0;k<4;k++){
        var xx = x + oneStep[k].x;
        var yy = y + oneStep[k].y;
        if (judge({x:xx,y:yy}) === true && kill[xx][yy]===0 && myVis[xx][yy]===0){
            if (t > 0){
                if (xx <= t){
                    scanKill(xx, yy, t);
                }
            }else{
                if (yy <= -t){
                scanKill(xx, yy, t);
                }
            }
        }
    }
}

function update(game){
    for (var k = 0;k<3;k++){
        vision[k] = game.gnomes[k].vision;
        start[k].x = game.gnomes[k].x;
        start[k].y = game.gnomes[k].y;

        var cen = game.gnomes[k];
        for (var i = max(0, cen.x - vision[k]);i<=min(width-1, cen.x + vision[k]);i++){
            for (var j = max(0, cen.y - vision[k]);j<=min(height-1, cen.y + vision[k]);j++){
                if (myabs(i - cen.x) + myabs(j - cen.y)<=vision[k]){
                    //console.log(i);
                   //console.log(j);
                    data[i][j] = game.map.data[i][j];
                    if (visited[i][j]>=0 && visited[i][j] + 1=== game.map.visited[i][j]){

                        //发现对方！
                       // console.log("shit!");
                      //  console.log(i,j);
                        for (var kk = 0;kk<3;kk++){
                            if (myabs(game.gnomes[kk].x -i) + myabs(game.gnomes[kk].y - j) <= 1){
                               // console.log("和对方距离小于等于1");
                               // console.log(kk,i,j);
                               // console.log(game.gnomes[kk]);
                            }
                        }

                    }
                    visited[i][j] = game.map.visited[i][j];
                }
            }
        }
    }
}

function check(src, dir) {
    if(data[src.x][src.y]!=-1 && (data[src.x][src.y] & dir) > 0) {
        return true;
    } else {
        return false;
    }
}

function judge(pos){
    if(pos.x>=0 && pos.x<width &&pos.y>=0 &&pos.y<height){
        return true;
    }
    return false;
}
var queue = [];
function find_short_path(src, gnomeId){
    for (var i = 0;i<width;i++){
        for (var j = 0;j<height;j++){
            gnomeDis[gnomeId][i][j] = -1;
            gnomeOpt[gnomeId][i][j] = -1;
            gnomeLast[gnomeId][i][j] = -1;
        }
    }
    for (var i =0;i<width *height;i++){
        queue[i] = -1;
    }
    var head = 0, tail = -1;
    gnomeDis[gnomeId][src.x][src.y] = 0;
    queue[++tail] = {x:src.x,y:src.y};

    for (var k = 0;k<4;k++){
        var dir = 1<<k;
        if (check(src, dir) === true){
            var pos = {};
            pos.x = src.x;
            pos.y = src.y;
            pos.x += oneStep[k].x;
            pos.y += oneStep[k].y;

            gnomeDis[gnomeId][pos.x][pos.y] = 1;
            gnomeOpt[gnomeId][pos.x][pos.y] = dir;
            gnomeLast[gnomeId][pos.x][pos.y] = k;

            queue[++tail] = {x:pos.x, y:pos.y};
        }
    }
  //  console.log("find short path");
    var steps = 0;
    while (head < tail && steps < width * height +1){
        steps++;
        head++;
       // console.log(head);
        var cur = {};

        cur.x = queue[head].x;
        cur.y = queue[head].y;

        for (var k = 0;k<4;k++){
            var pos = {};
            pos.x = cur.x;
            pos.y = cur.y;

            pos.x += oneStep[k].x;
            pos.y += oneStep[k].y;
            if (check(cur, 1<<k)===true && gnomeDis[gnomeId][pos.x][pos.y] === -1){
                    gnomeDis[gnomeId][pos.x][pos.y] = gnomeDis[gnomeId][cur.x][cur.y]  + 1;
                    gnomeOpt[gnomeId][pos.x][pos.y] = gnomeOpt[gnomeId][cur.x][cur.y];
                    gnomeLast[gnomeId][pos.x][pos.y] = k;
                    queue[++tail] = {x:pos.x, y:pos.y};
            }
        }
    }
    //console.log("find end!");
    return ;
}

var optAim = [];
function calc_maha(x,y,xx,yy){
    return myabs(x - xx) + myabs(y - yy);
}
function goToAim(src, dest, gnomeId)
{
   return gnomeOpt[gnomeId][dest.x][dest.y];
}

function A_Star_find(src, gnomeId){
    find_short_path(src, gnomeId);
    var high = 100000000;
    var inf = high;
    var a = tiaoCan[gnomeId][0];
    var b = tiaoCan[gnomeId][1];
    var c = tiaoCan[gnomeId][2];
    var d = 1.5;
    var e = 2;
    var dir = 0;
    var dirVal = [];
    for (var i = 0;i<4;i++){
        dirVal[i] = inf;
    }
    if (gnomeDis[gnomeId][finalX][finalY] !== -1){
        return gnomeOpt[gnomeId][finalX][finalY];
    }
    for (var i = 0;i<width;i++){
        for (var j = 0;j<height;j++){
            if (gnomeDis[gnomeId][i][j] !== -1 && kill[i][j] === 0){
                if (data[i][j] === -1){
                    var ddd = (gnomeLast[gnomeId][i][j] + 2)%4;;
                    var x = i + oneStep[ddd].x;
                    var y = j + oneStep[ddd].y;
                    var vi = 0;
                    if (visited[x][y] > 0){
                        vi = 1;
                    }
                    var val = calc_maha(i,j,finalX,finalY) * a + gnomeDis[gnomeId][i][j] * b + (vi) *  c;

                    //val += (myabs(j - (i *3/4)) + myabs(i - (j*4/3))) * d;

                    var dd = gnomeOpt[gnomeId][i][j];
                    var sss = 0;
                    if (dd === 1){
                        sss = 0;
                    }else if (dd === 2){
                        sss = 1;
                    }else if (dd === 4){
                        sss = 2;
                    }else{
                        sss = 3;
                    }
                    var ttt = 0;
                    if((His[gnomeId][src.x][src.y] & dd) > 0)
                        ttt = 1 ;
                    val = val + (ttt) * e;

                    //optAim.push({x:i, y:j, val:val});
                    if (val < dirVal[sss]){
                        dirVal[sss] = val;
                    }

                    if (val < inf){
                        inf = val;
                        dir = gnomeOpt[gnomeId][i][j];
                    }
                }
            }
        }
    }

   // console.log(dir);
   if (dir === 0){
      // console.log("shit!!!");
      dir = turnLeft(turnLeft(lastDir[gnomeId]));
   }
    return dir;

}



var tmp = 0;





onMyTurn = function(game) {
    tmp++;
    if(ifFirstMove) {
        for (var i = 0;i<3;i++){
            times[i] = 0;
            lastDir[i] = 0;
        }
        init(game);
        update(game);

        ifFirstMove = false;
        if(game.gnomes[0].x === 0) {
            finalX = width - 1;
            finalY = height - 1;
            startX = 0;
            startY = 0;
            gnomeDir[0] = 2;
            gnomeDir[1] = 4;
        } else {
            finalX = 0;
            finalY = 0;
            startX = width - 1;
            startY = height - 1;
            gnomeDir[0] = 1;
            gnomeDir[1] = 8;
        }
        for (var i = 0;i<3;i++){
            gnomeAim[i].x = game.gnomes[i].x;
            gnomeAim[i].y = game.gnomes[i].y;
        }




        gnomeAim[0].dir = gnomeDir[0];
        gnomeAim[1].dir = gnomeDir[1];
        gnomeAim[2].dir = -1;
    }else{
        update(game);
    }



    var action = [];


    action[0] = A_Star_find(game.gnomes[0],0);
    action[1] = A_Star_find(game.gnomes[1],1);
    action[2] = A_Star_find(game.gnomes[2],2);
    for (var i = 0;i<3;i++){
        if (His[i][start[i].x][start[i].y] & action[i] === 0)
            His[i][start[i].x][start[i].y] += action[i];
        if (lastDir[i]!==0 && turnLeft(turnLeft(lastDir[i])) === action[i]){
            if (game.gnomes[i].y < game.gnomes[i].vision){
                scanKill(game.gnomes[i].x, game.gnomes[i].y, game.gnomes[i].x);
              //  console(game.gnomes[i]);
            }
            if (game.gnomes[i].y + game.gnomes[i].vision > height){
                scanKill(game.gnomes[i].x, game.gnomes[i].y, game.gnomes[i].x);
            }

            if (game.gnomes[i].x < game.gnomes[i].vision){
                scanKill(game.gnomes[i].x, game.gnomes[i].y, -game.gnomes[i].y);
               // console(game.gnomes[i]);
            }
            if (game.gnomes[i].x + game.gnomes[i].vision > width){
                scanKill(game.gnomes[i].x, game.gnomes[i].y, -game.gnomes[i].y);
            }

        }

        lastDir[i] = action[i];
    }
    return action;
};
