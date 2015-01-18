//整个图的标记
var mapFlag = [];
//每个地精走过的路的标记
var myVis = [];
//对方走过的标记
var mapVisited = [];
//所有出现在视野里面的对方的坐标
var gogalVisited = new Array(new Array(1000),new Array(1000));
var visQ = 0;

var getGogalFlag = new Array(false,false,false); //是否到达初始目标
var lastGogalX = -1,lastGogalY = -1;             //最终目标

//三个地精的走的过程
var pathVis = [[[],[]],[[],[]],[[],[]]];
var pathVisQ = new Array(3);    

var width = 100;
var height = 75;
var vision = 15;
var leftX = 200,rightX = 0,topY = 150,bottomY = 0;
var gogal = new Array(new Array(0,74),new Array(99,0),new Array(0,0),new Array(99,74));

var totalStep = 0;

var selfX = -1,selfY = -1;
var DirX = new Array(0,1,0,-1);
var DirY = new Array(-1,0,1,0);
var DirC = new Array(1,2,4,8);
var gogalX,gogalY;
var QQ = [[],[],[],[]];

function testDir(c)
{
    var cnt = 0;
    if((c & 1) > 0) cnt++;
    if((c & 2) > 0) cnt++;
    if((c & 4) > 0) cnt++;
    if((c & 8) > 0) cnt++;
    return cnt;
}
function testDir2(c,stX,stY)
{
    var cnt = 0,i,nextX,nextY;
    for(i = 0;i < 4;i++)
    {
        if((c & DirC[i]) > 0)
        {
            nextX = stX + DirX[i];
            nextY = stY + DirY[i];
            if(inMap(nextX,nextY) === false) continue;
            if(mapFlag[nextX][nextY] === undefined) cnt++;
            else if(mapFlag[nextX][nextY] !== undefined && mapFlag[nextX][nextY] < 20000) cnt++;
        }
    }
    return cnt;
}
function testEffectDir(j,c,stX,stY,l)
{
    var cnt = 0,i,nextX,nextY;
    for(i = 0;i < 4;i++)
    {
        if((c & DirC[i]) > 0 && (i + 2) % 4 !== l)
        {
            nextX = stX + DirX[i];
            nextY = stY + DirY[i];
            if(inMap(nextX,nextY) === false) continue;
            if(mapFlag[nextX][nextY] === undefined) cnt++;
            else if(mapFlag[nextX][nextY] !== undefined && mapFlag[nextX][nextY] < 20000) cnt++;
        }
    }
    return cnt;
}
function inMap(x,y)
{
    if(x >= 0 && x < width && y >= 0 && y < height) return true;
    else return false;
}
var cntPath;

function bfs(preX,preY,stX,stY,edX,edY)
{
    if(stX === edX && stY === edY)
    {
        return 1;
    }
    QQ[0][0] = stX;
    QQ[1][0] = stY;
    QQ[2][0] = 1;
    var pre = 0,rear = 1,curX,curY,curStep,nextX,nextY;
    var flag = [];
    for(var ii = 0;ii < width;ii++)
    {
        flag[ii] = [];
        for(var j = 0;j < height;j++)
        {
            flag[ii][j] = 0;
        }
    }
    flag[stX][stY] = 1;
    if(preX !== -1) flag[preX][preY] = 1;
    
    while(pre < rear)
    {
        curX = QQ[0][pre];
        curY = QQ[1][pre];
        curStep = QQ[2][pre];
        for(var i = 0;i < 4;i++)
        {
            if((mapFlag[curX][curY] & DirC[i]) > 0)
            {
                nextX = curX + DirX[i];
                nextY = curY + DirY[i];
                if(inMap(nextX,nextY) === true && flag[nextX][nextY] === 0 && mapFlag[nextX][nextY] !== undefined && mapFlag[nextX][nextY] < 20000)
                {
                    if(nextX === edX && nextY === edY)
                    {
                        return curStep;
                    }
                    else
                    {
                        flag[nextX][nextY] = 1;
                        QQ[0][rear] = nextX;
                        QQ[1][rear] = nextY;
                        QQ[2][rear] = curStep + 1;
                        rear++;
                    }
                }
            }
        }
        pre++;
    }
    if(pre === rear) return -1;
}
function testBfsForEnery(stX,stY)
{
    QQ[0][0] = stX;
    QQ[1][0] = stY;
    QQ[2][0] = 0;
    QQ[3][0] = 0;
    var pre = 0,rear = 1,curX,curY,curStep,curSum,nextX,nextY,dis,myDis = Math.abs(stX - gogalX) + Math.abs(stY - gogalY);
    var flag = [];
    for(var ii = 0;ii < width;ii++)
    {
        flag[ii] = [];
        for(var j = 0;j < height;j++)
        {
            flag[ii][j] = 0;
        }
    }
    flag[stX][stY] = 1;
    while(pre < rear)
    {
        curX = QQ[0][pre];
        curY = QQ[1][pre];
        curStep = QQ[2][pre];
        curSum = QQ[3][pre];
        for(var i = 0;i < 4;i++)
        {
            if((mapFlag[curX][curY] & DirC[i]) > 0)
            {
                nextX = curX + DirX[i];
                nextY = curY + DirY[i];
                if(flag[nextX][nextY] === 0 && mapFlag[nextX][nextY] !== undefined && mapFlag[nextX][nextY] < 20000)
                {
                    if(mapVisited[nextX][nextY] > 0)
                    {
                        dis = Math.abs(nextX - gogalX) + Math.abs(nextX - gogalY);
                        if(dis < myDis - 1 && curStep > 2) return true; 
                    }
                    flag[nextX][nextY] = 1;
                    QQ[0][rear] = nextX;
                    QQ[1][rear] = nextY;
                    QQ[2][rear] = curStep + 1;
                    QQ[3][rear] = curSum + testDir2(mapFlag[nextX][nextY],nextX,nextY) - 2;
                    rear++;
                }
            }
        }
        pre++;
    }
    return false;
}

var curMinREQ;

function bfs2(x,y,x2,y2)
{
    QQ[0][0] = x2;
    QQ[1][0] = y2;
    QQ[2][0] = 0;
    var pre = 0,rear = 1,curX,curY,curStep,nextX,nextY,dis;
    var flag = [];
    for(var ii = 0;ii < width;ii++)
    {
        flag[ii] = [];
        for(var j = 0;j < height;j++)
        {
            flag[ii][j] = 0;
        }
    }
    flag[x2][y2] = 1;
    flag[x][y] = 1;
    while(pre < rear)
    {
        curX = QQ[0][pre];
        curY = QQ[1][pre];
        curStep = QQ[2][pre];
        for(var i = 0;i < 4;i++)
        {
            if((mapFlag[curX][curY] & DirC[i]) > 0)
            {
                nextX = curX + DirX[i];
                nextY = curY + DirY[i];
                if(inMap(nextX,nextY) === true && flag[nextX][nextY] === 0)
                {
                    if(mapFlag[nextX][nextY] === undefined)
                    {
                        dis = Math.abs(nextX - gogalX) + Math.abs(nextY - gogalY) + curStep;
                        curMinREQ = Math.min(curMinREQ,dis);
                    }
                    else if(mapFlag[nextX][nextY] < 20000)
                    {
                        flag[nextX][nextY] = 1;
                        QQ[0][rear] = nextX;
                        QQ[1][rear] = nextY;
                        QQ[2][rear] = curStep + 1;
                        rear++;
                    }
                }
            }
        }
        pre++;
    }
}
var flag = [];
function dfs(stX,stY,edX,edY)        //测试之前目标到当前点的路有多少条
{
    if(stX === edX && stY === edY) return ;
    var nextX,nextY,cur;
    for(var i = 0;i < 4;i++)
    {
        if((mapFlag[stX][stY] & DirC[i]) > 0)
        {
            nextX = stX + DirX[i];
            nextY = stY + DirY[i];
            if(inMap(nextX,nextY) === true && flag[nextX][nextY] === 0 && mapFlag[nextX][nextY] !== undefined)
            {
                if(nextX === edX && nextY === edY)
                {
                    cntPath++;
                }
                else if(mapFlag[nextX][nextY] < 20000)
                {
                    flag[nextX][nextY] = 1;
                    dfs(nextX,nextY,edX,edY);
                    flag[nextX][nextY] = 0;
                }
            }
        }
    }  
}
function getPreDir(stX,stY,nextX,nextY)
{
    if(stX === nextX)
    {
        if(nextY === stY - 1) return 4;
        else return 1;
    }
    else
    {
        if(nextX === stX - 1) return 2;
        else return 8;
    }
}
function testRing(stX,stY)
{
    var i,j,nextX,nextY,cell,preDir,step = 0,cnt,curX = stX,curY = stY,tmpX,tmpY;
    var path = [[],[]];
    for(i = 0;i < 4;i++)
    {
        cell = mapFlag[stX][stY]; 
        if((cell & DirC[i]) > 0)
        {
            nextX = stX + DirX[i];
            nextY = stY + DirY[i];
            if(inMap(nextX,nextY) === true && mapFlag[nextX][nextY] !== undefined && mapFlag[nextX][nextY] < 20000)
            {
                curX = nextX;
                curY = nextY;
                preDir = i;
                step = 0;
                while(1)
                {
                    path[0][step] = nextX;
                    path[1][step] = nextY;
                    cell = mapFlag[curX][curY];
                    for(var l = 0;l < 4;l++)
                    {
                        if((cell & DirC[l]) > 0)
                        {
                            tmpX = curX + DirX[l];
                            tmpY = curY + DirY[l];
                            if(mapFlag[tmpX][tmpY] === undefined && mapFlag[tmpX][tmpY] >= 20000) continue;
                            cnt++;
                        }
                    }
                    if(cnt !== 2) break;
                    for(j = 0;j < 4;j++)
                    {
                        if((j + 2) % 4 === preDir) continue;
                        if((cell & DirC[j]) > 0)
                        {
                            nextX = curX + DirX[j];
                            nextY = curY + DirY[j];
                            if(inMap(nextX,nextY) === true && mapFlag[nextX][nextY] !== undefined && mapFlag[nextX][nextY] < 20000)
                            {
                                break;
                            }
                        }
                    }
                    if(j === 4) break;
                    if(nextX === stX && nextY === stY) break;
                    curX = nextX;
                    curY = nextY;
                    preDir = j;
                    step++;
                }
                if(j !== 4 && nextX === stX && nextY === stY)
                {
                    for(i = 0;i < step;i++)
                    {
                        mapFlag[path[0][i]][path[1][i]] = 20000;
                    }
                }
            }
        }
    }
}
function plugMap(stX,stY,game) {
    var i,nextX,nextY,preDir;
    for(i = 0;i < 4;i++)
    {
        if((mapFlag[stX][stY] & DirC[i]) > 0) 
        {
            nextX = stX + DirX[i];
            nextY = stY + DirY[i];
            if(inMap(nextX,nextY) === false || mapFlag[nextX][nextY] >= 20000) continue;
            else break;
        }
    }
    preDir = i;
    if(mapFlag[nextX][nextY] === undefined)
    {
        mapFlag[stX][stY] = 20000 + mapFlag[stX][stY]; 
    }
    else 
    {
        mapFlag[stX][stY] = 20000;
        if((nextX === 0 && (nextY === 0 || nextY === height - 1)) || (nextX === width && (nextY === 0 || nextY === height - 1))) ;
        else if(nextX === game.gnomes[0].x && nextY === game.gnomes[0].y) ;
        else if(nextX === game.gnomes[1].x && nextY === game.gnomes[1].y) ;
        else if(nextX === game.gnomes[2].x && nextY === game.gnomes[2].y) ;
        else if(testDir(mapFlag[nextX][nextY]) === 1)
        {
            mapFlag[nextX][nextY] = 20000; 
        }
        else
        {
            var sign = true;
            while(testDir(mapFlag[nextX][nextY]) === 2)
            {
                mapFlag[stX][stY] = 20000;
                for(i = 0;i < 4;i++)
                {
                    if((mapFlag[nextX][nextY] & DirC[i]) > 0 && ((i + 2) % 4 !== preDir)) break;
                }
                preDir = i;
                stX = nextX;
                stY = nextY;
                nextX = stX + DirX[i];
                nextY = stY + DirY[i];
                for(var k = 0;k < 3;k++)
                {
                    if(nextX === game.gnomes[k].x && nextY === game.gnomes[k].y) 
                    {
                        mapFlag[stX][stY] = 20000;
                        sign = false;
                        break;
                    }
                }
                
                if(sign === false) break;
                
                if((nextX === 0 && (nextY === 0 || nextY === height - 1)) || (nextX === width - 1 && (nextY === 0 || nextY === height - 1))) 
                {
                    mapFlag[stX][stY] = 20000;
                    break;
                }
                if(mapFlag[nextX][nextY] === undefined)
                {
                    mapFlag[stX][stY] = 20000 + mapFlag[stX][stY];
                    break;
                }
                else if(mapFlag[nextX][nextY] >= 20000)
                {
                    mapFlag[stX][stY] = 20000;
                    break;
                }
                if(testDir(mapFlag[nextX][nextY]) === 1) 
                {
                    mapFlag[stX][stY] = 20000;
                    mapFlag[nextX][nextY] = 20000;
                    break;
                }
            }
        }
    }
}
function testMulPath(j,preX,preY,stX,stY,l)
{
    var i,nextX,nextY,cell = mapFlag[stX][stY],cnt,curX = stX,curY = stY,k = l;
    while(1)
    {
        cnt = testEffectDir(j,cell,curX,curY,l);
        if(cnt >= 2) return true;
        if(cnt == 0) return false; 
        
        for(i = 0;i < 4;i++)
        {
            if(((cell & DirC[i]) > 0)  && ((i + 2) % 4 !== k))
            {
                nextX = curX + DirX[i];
                nextY = curY + DirY[i];
                if(inMap(nextX,nextY) === false) continue;
                if(mapFlag[nextX][nextY] === undefined) return true;
                if(mapFlag[nextX][nextY] >= 20000) continue;
                else break;
            }
        }
        if(nextX === undefined || nextY === undefined) return false;
        if(myVis[j][nextX][nextY] === undefined) return true;
        else if(myVis[j][nextX][nextY] > 0) return false;
        curX = nextX;
        curY = nextY;
        k = i;
        cell = mapFlag[curX][curY];
    }
    
}

onMyTurn = function(game) {
    totalStep++;
    var x,y,i,j,k,nextX,nexY,l,curCell,curCellDis,curCellMinDis,DirNum;
    var move = new Array(3);
    var tmpREQ = new Array(4);
    if(selfX === -1)                    //初始化Map
    {
        selfX = game.gnomes[0].x;
        selfY = game.gnomes[0].y;
        
        lastGogalX = width - selfX - 1;
        lastGogalY = height - selfY - 1;
        for(i = 0;i < 3;i++)
        {
            if(pathVisQ[i] === undefined) pathVisQ[i] = 0;
            myVis[i] = [];
            for(j = 0;j < width;j++)
            {
                myVis[i][j] = [];
                for(k = 0;k < height;k++)
                {
                    myVis[i][j][k] = 0;
                }
            }
        }
        for(i = 0;i < width;i++)
        {
            mapVisited[i] = [];
            mapFlag[i] = [];
            for(j = 0;j < height;j++)
            {
                mapVisited[i][j] = 0;
                mapFlag[i][j] = undefined;
            }
        }
    }
    for(i = 0;i < 3;i++)                //change the Vis的值
    {
        if(i === 2 && selfX === gogal[i][0])
        {
            gogalX = gogal[i + 1][0];
            gogalY = gogal[i + 1][1];
        }
        else
        {
            gogalX = gogal[i][0];
            gogalY = gogal[i][1];
        }
        if((game.gnomes[i].x === gogalX && game.gnomes[i].y === gogalY) || mapVisited[gogalX][gogalY] > 0)
        {
            getGogalFlag[i] = true;
        }
        pathVis[i][0][pathVisQ[i]] = game.gnomes[i].x;
        pathVis[i][1][pathVisQ[i]] = game.gnomes[i].y;
        pathVisQ[i]++;
        myVis[i][game.gnomes[i].x][game.gnomes[i].y] += 1;
    }
    for(i = 0;i < 3;i++)                //更新map
    {
        vision = game.gnomes[i].vision;
        x = game.gnomes[i].x;
        y = game.gnomes[i].y;
        
        for(j = x - vision;j <= x + vision;j++)
        {
            for(k = y - vision;k <= y + vision;k++)
            {
                if(Math.abs(j - x) + Math.abs(k - y) > vision) continue;
                if(j >= 0 && j < width && k < height && k >= 0)
                {
                    
                    if(mapFlag[j][k] === undefined) mapFlag[j][k] = game.map.data[j][k]; 
                    if(game.map.visited[j][k] !== 0) 
                    {
                        mapVisited[j][k] = game.map.visited[j][k];
                    }
                    leftX = Math.min(leftX,j);
                    rightX = Math.max(rightX,j);
                    topY = Math.min(topY,k);
                    bottomY = Math.max(bottomY,k);
                }
            }
        }
    }
    var sign = true;
    var sum;
    do                                  //plugMap
    {
        var cnt;
        sum = 0;
        for(i = leftX;i <= rightX;i++)
        {
            for(j = topY;j <= bottomY;j++)
            {
                if(mapFlag[i][j] === undefined || mapFlag[i][j] === 20000) continue;
                
                if((i === 0 && (j === 0 || j === height - 1)) || (i === width - 1 && (j === 0 || j === height - 1))) continue;
                
                if(mapFlag[i][j] > 20000 && sign === true)   
                {
                    sum++;
                    plugMap(i,j,game);
                }
                else
                {
                    DirNum = testDir(mapFlag[i][j]);
                    if(DirNum > 1) 
                    {
                        cnt = 0;
                        for(k = 0;k < 4;k++)
                        {
                            if((mapFlag[i][j] & DirC[k]) > 0)
                            {
                                nextX = i + DirX[k];
                                nextY = j + DirY[k];
                                if(mapFlag[nextX][nextY] !== undefined && mapFlag[nextX][nextY] >= 20000) continue;
                                cnt++;
                            }
                        }
                        if(cnt <= 1) 
                        {
                            sum++;
                            plugMap(i,j,game);
                        }
                        else 
                        {
                            testRing(i,j);                //环与不环的区别
                            continue;
                        }
                    }
                    if(DirNum === 1 && sign === true) 
                    {
                        sum++;
                        plugMap(i,j,game);
                    }
                    else mapFlag[i][j] = 20000;
                }
            }
        }
        sign = false;
    }while(sum > 0);
    
    for(j = 0;j < 3;j++)                //先确定是否存在到达确定目标的路，然后再搜视野之外的点作为新的目标点
    {
        if(move[j] !== undefined) continue;
        if(getGogalFlag[j] === true) 
        {
            gogalX = lastGogalX;
            gogalY = lastGogalY;
        }
        else
        {
            if(j === 2 && selfX === gogal[j][0])
            {
                gogalX = gogal[j + 1][0];
                gogalY = gogal[j + 1][1];
            }
            else
            {
                gogalX = gogal[j][0];
                gogalY = gogal[j][1];
            }
        }
        x = game.gnomes[j].x;
        y = game.gnomes[j].y;
        curCell = game.map.data[x][y];

        var minStep = 20000;
        for(l = 0;l < 4;l++)
        {
            if((curCell & DirC[l]) > 0)
            {
                nextX = x + DirX[l];
                nextY = y + DirY[l];
                if(mapFlag[nextX][nextY] !== undefined && mapFlag[nextX][nextY] >= 20000) continue;
                
                step = bfs(x,y,nextX,nextY,gogalX,gogalY);

                if(step !== -1 && step < minStep)
                {
                    minStep = step;
                    move[j] = DirC[l];
                }
            }
        }
        if(move[j] === undefined)
        {
            curCellMinDis = 20000;
            var cntt = 0;
            var reX,reY;
            for(l = 0;l < 4;l++)
            {
                if((curCell & DirC[l]) > 0)
                {
                    nextX = x + DirX[l];
                    nextY = y + DirY[l];

                    if(mapFlag[nextX][nextY] >= 20000) continue;
                    else
                    {
                        if(testMulPath(j,x,y,nextX,nextY,l) === false) continue;

                        curMinREQ = 20000;
                        
                        bfs2(x,y,nextX,nextY);
                        
                        tmpREQ[l] = curMinREQ;

                        if(curMinREQ !== 20000)
                        { 
                            cntt++;
                            if(curMinREQ < curCellMinDis)
                            {
                                move[j] = DirC[l];
                                curCellMinDis = curMinREQ;
                                reX = nextX;
                                reY = nextY;
                            }
                        }
                    }
                }
            } 
            if(reX === undefined || (myVis[j][reX][reY] > 0 && cntt <= 1))
            {
                move[j] = getPreDir(pathVis[j][0][pathVisQ[j] - 2],pathVis[j][1][pathVisQ[j] - 2],pathVis[j][0][pathVisQ[j] - 1],pathVis[j][1][pathVisQ[j] - 1]);
                mapFlag[pathVis[j][0][pathVisQ[j] - 1]][pathVis[j][1][pathVisQ[j] - 1]] = 20000;
                pathVisQ[j] = pathVisQ[j] - 2;
            }
            else if(myVis[j][reX][reY] > 0 && cntt > 1)
            {
                var minn = 20000;
                for(l = 0;l < 4;l++)
                {
                    if(tmpREQ[l] !== undefined && tmpREQ[l] !== 20000 && move[j] !== DirC[l] && minn > tmpREQ[l])
                    {
                        minn = tmpREQ[l];
                        move[j] = DirC[l];
                    }
                }

                curMinREQ = 20000;

                bfs2(x,y,pathVis[j][0][pathVisQ[j] - 2],pathVis[j][1][pathVisQ[j] - 2]);

                if(curMinREQ < minn)                                                                  //此时比较选择较好的策略
                {
                    move[j] = getPreDir(pathVis[j][0][pathVisQ[j] - 2],pathVis[j][1][pathVisQ[j] - 2],pathVis[j][0][pathVisQ[j] - 1],pathVis[j][1][pathVisQ[j] - 1]);   
                    mapFlag[pathVis[j][0][pathVisQ[j] - 1]][pathVis[j][1][pathVisQ[j] - 1]] = 20000;
                    pathVisQ[j] = pathVisQ[j] - 2;
                }
            }
        }
    }
    
    for(i = 0;i < 3;i++)
    {
        if(move[i] === undefined)
        {
            move[i] = getPreDir(pathVis[i][0][pathVisQ[i] - 2],pathVis[i][1][pathVisQ[i] - 2],pathVis[i][0][pathVisQ[i] - 1],pathVis[i][1][pathVisQ[i] - 1]);
            mapFlag[pathVis[i][0][pathVisQ[i] - 1]][pathVis[i][1][pathVisQ[i] - 1]] = 20000;
            pathVisQ[i] = pathVisQ[i] - 2;
        }
    }
    return move; 
};