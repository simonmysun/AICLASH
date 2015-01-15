/**
 * Created by HYL on 2015/1/7.
 * 移除与获取Buff相关的操作？
 * 如果地图上看到了敌人的足迹，就以此作为当前goal
 */
var SelfFootPrints = [];
var FootPrints = [];
var WorldMap = [];
var BFSMask = [];
//记录某个位置是否已经是某只地精的目的地了
var isGoal = [];
var width = -1;
var height = -1;
//记录起始位置
var start = {};
//记录目标位置
var target = {};
//记录buff药水的位置
var buff = {};
//是否使用buff药水
var useBuff = false;
//是否已经得到buff药水
var gotBuff = false;
//不去拿药水的两种地精是否在一起？
var isTogether = true;
//记录每只地精是否已经找到过敌人足迹（是否找到，不是踩上）
var foundFootPrint = [false, false, false];

var INF = 1<<30;
var WEIGHT = -100;
var mov = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
];
var time = 0;

function Pos(x, y, father, dist) {
    this.x = x;
    this.y = y;
    this.father = father;
    this.dist = dist;
    this.isLegal = function () {
        //必须在地图有效范围内并且没有被搜索到过
        return ( this.x < width && this.x >= 0 && this.y < height && this.y >= 0 && !BFSMask[this.x][this.y] );
    };
    //生成对象的时候自动评估它的有效性
    this.legal = this.isLegal();
}

function evalPositionWithFootPrints( start, goal ) {
    //评估方法：
    //目的地与目标的曼哈顿距离
    //当前与目的地的距离
    //目的地的足迹数量
    return manhattanDistance(start.x, start.y, goal.x, goal.y)
        + start.dist
        + FootPrints[start.x][start.y] * WEIGHT;
}

function evalPositionWithFootPrintsUnweighted( start, goal ) {
    //评估方法：
    //目的地与目标的曼哈顿距离
    //当前与目的地的距离
    //目的地的足迹数量
    return manhattanDistance(start.x, start.y, goal.x, goal.y)
        + start.dist
        + (FootPrints[start.x][start.y] > 0 ? 1 : 0) * WEIGHT;
}

function evalPositionWithoutFootPrints( start, goal ) {
    //评估方法：
    //目的地与目标的曼哈顿距离
    //当前与目的地的距离
    return manhattanDistance(start.x, start.y, goal.x, goal.y) + start.dist;
}

function manhattanDistance( src_x, src_y, dst_x, dst_y ) {
    return Math.abs(src_x - dst_x) + Math.abs(src_y - dst_y);
}

//初始化全局地图
function initMaps( w, h, gnomes ) {
    //设定全局地图大小
    width = w;
    height = h;
    //设定目的地
    start = gnomes[0];
    if ( gnomes[0].x === 0 && gnomes[0].y === 0 ) {
        target.x = width - 1;
        target.y = height - 1;
        buff.x = 0;
        buff.y = height - 1;
    } else {
        target.x = 0;
        target.y = 0;
        buff.x = width - 1;
        buff.y = 0;
    }
    //建立地图
    for ( var x = 0; x < width; x++ ) {
        SelfFootPrints[x] = [];
        FootPrints[x] = [];
        WorldMap[x] = [];
        BFSMask[x] = [];
        isGoal[x] = [];
        for ( var y = 0; y < height; y++ ) {
            SelfFootPrints[x][y] = 0;
            FootPrints[x][y] = 0;
            WorldMap[x][y] = -1;
            BFSMask[x][y] = 0;
            isGoal[x][y] = 0;
        }
    }
}

//清空visited标记
function clearMasks() {
    for ( var x = 0; x < width; x++ )
        for ( var y = 0; y < height; y++ ) BFSMask[x][y] = 0;
}

//清空目标选取标记
function clearGoals() {
    for ( var x = 0; x < width; x++ )
        for ( var y = 0; y < height; y++ )
            isGoal[x][y] = 0;
}

//更新全局地图
function updateWorldMap( game ) {
    for ( var g = 0; g < game.gnomes.length; g++ )
        for ( var x = 0; x < width; x++ )
            for ( var y = 0; y < height; y++ )
                if ( manhattanDistance(x, y, game.gnomes[g].x, game.gnomes[g].y) <=
                    game.gnomes[g].vision ) {
                //一定用最新的敌人足迹
                FootPrints[x][y] = game.map.visited[x][y];
                WorldMap[x][y] = game.map.data[x][y];
            }
}

//第一种随机选取策略：选择前两个估值最好的中其一，目的是让在一起的两只地精分开
function randomSelect( array ) {
    var rate = [1];
    if ( isTogether ) rate = [0.7, 0.3];
        var sum = 0;
    for ( var i = 0; i < Math.min(array.length, rate.length); i++ ) {
        sum += rate[i];
        if ( Math.random() < sum ) return array[i];
    }
    return array[0];
}

//第二种选取策略：差异化选取，地精们的目标必须不同
//并且距离目标近的也有资格选取目的地
function DiffSelect( array ) {
    for ( var i = 0; i < array.length; i++ ) {
        //如果某个格子尚未被设置为目的地
        //或者当前地精距离这个格子更近，就更新
        if ( !isGoal[array[i].x][array[i].y] ||
            array[i].dist < isGoal[array[i].x][array[i].y] ) {
            isGoal[array[i].x][array[i].y] = array[i].dist;
            return array[i];
        }
    }
    if ( isGoal[array[0].x][array[0].y] > array[0].dist )
        isGoal[array[0].x][array[0].y] = array[0].dist;
    return array[0];
}

function BFS(gnome, goal, evalFunc) {
    var que = [];
    var candidates = [];
    clearMasks();
    BFSMask[gnome.x][gnome.y] = 1;
    //先广搜一遍，列出所有可行的候选位置
    que.push(new Pos(gnome.x, gnome.y, null, 0));
    while ( que.length > 0 ) {
        var cur = que.shift();
        //目标格子只有两种状态：可见/位于迷雾
        //如果某个格子正好处于迷雾中，那么就评估它的值
        //然后将其加入候选目的地
        if ( WorldMap[cur.x][cur.y] === -1 ) {
            cur.value = evalFunc(cur, goal);
            candidates.push(cur);
            continue;
        }
        for ( var k = 0; k < 4; k++ ) {
            var new_pos = new Pos(cur.x + mov[k][0], cur.y + mov[k][1], cur, cur.dist + 1);
            //如果向这个方向走是合法的，且新的位置同样是合法的，那么就把这个位置加入队列
            if ( (WorldMap[cur.x][cur.y] & (1<<k)) > 0 && new_pos.legal ) {
                BFSMask[new_pos.x][new_pos.y] = 1;
                que.push(new_pos);
                //如果搜索过程中目标可见，就直接返回目标本身
                //此时已经一定是最短路了
                if ( new_pos.x == goal.x && new_pos.y == goal.y ) {
                    return new_pos;
                }
            }
        }
    }

    //接下来对候选目的地按照估值排序
    candidates.sort(function(a,b){return a.value> b.value?1:-1});
    //再从中按照选取策略选取一个
    return DiffSelect(candidates);
}

function calcBFS_Status() {
    var sum = 0;
    for ( var x = 0; x < width; x++ )
        for ( var y = 0; y < height; y++ )
            sum += BFSMask[x][y];
    return sum;
}

function findNearestFootPrints( gnome ) {
    var min = INF;
    var result = null;
    for ( var x = 0; x < width; x++ ) {
        for ( var y = 0; y < height; y++ ) if ( FootPrints[x][y] > 0 ) {
            var val = manhattanDistance(gnome.x, gnome.y, x, y);
            if ( val < min ) {
                min = val;
                result = {'x': x, 'y': y};
            }
        }
    }
    return result;
}

onMyTurn = function (game) {
    //更新计时器
    time++;
    //读取并初始化变量
    var gnomes = game.gnomes;

    //判断当前格局
    for ( var i = 0; i < gnomes.length; i++ ) {
        //如果已经胜利，就输出统计信息
        //if ( gnomes[i].x == target.x && gnomes[i].y == target.y ) {
        //    var msg = "";
        //    if ( target.x === 0 ) {
        //        msg += "Right down corner won!\n";
        //    } else {
        //        msg += "Left up corner won!\n";
        //    }
        //    var statics = BFS(gnomes[i], start, evalPositionWithFootPrints);
        //    msg += ("Shortest path: " + statics.dist + "\n");
        //    msg += ("Road found by AI: " + time + "\n");
        //    msg += ("BFS Status: " + calcBFS_Status() + "/" + width*height + "\n");
        //    msg += JSON.stringify(gnomes);
        //    msg += "\n";
        //    postMessage(JSON.stringify([msg]));
        //    while (true) {}
        //    //提交时注释掉上面三行
        //    //return [0, 0, 0];
        //}
        //判断是否拿到了buff药水
        if ( gnomes[i].x == buff.x && gnomes[i].y == buff.y ) {
            gotBuff = true;
        }
    }

    //判断是否有两只地精在一起
    isTogether = (
        gnomes[1].x == gnomes[2].x && gnomes[1].y == gnomes[2].y ||
        gnomes[0].x == gnomes[2].x && gnomes[0].y == gnomes[2].y ||
        gnomes[0].x == gnomes[1].x && gnomes[0].y == gnomes[1].y
    );

    //初始化/更新记忆地图
    if ( WorldMap.length === 0 ) initMaps(game.width, game.height, gnomes);
    updateWorldMap(game);

    for ( var g = 0; g < gnomes.length; g++ ) {
        SelfFootPrints[gnomes[g].x][gnomes[g].y]++;
        if ( FootPrints[gnomes[g].x][gnomes[g].y] > 0 )
            foundFootPrint[g] = true;
    }

    var Trapped = false;
    for ( var x = 0; x < width; x++ )
        for ( var y = 0; y < height; y++ ) if ( SelfFootPrints[x][y] > 5 )
            Trapped = true;

    //清空目标标记
    clearGoals();
    var result = [];
    for ( g = 0; g < gnomes.length; g++ ) {
        //设定目标位置，如果需要使用buff且尚未找到buff，则将buff设为目标
        var next_pos, goal, evalFunc;
        if ( g === 0 && useBuff && !gotBuff ) {
            goal = buff;
        } else {
            goal = target;
        }
        //如果还没走上过敌人足迹（如果已经找到过足迹，就无需再将其作为目标了）
        //PS:这里添加一个参数，控制有几个地精使用这个策略
        if ( g < 3 && !foundFootPrint[g] ) {
            //并且周围有敌人足迹，就将足迹设为目标
            var foot = findNearestFootPrints(gnomes[g]);
            if ( foot !== null ) goal = foot;
        }
        //设定评估函数，地精不一定沿着敌人的足迹行走
        if ( g > 3 ) {
            evalFunc = evalPositionWithoutFootPrints;
        } else {
            evalFunc = evalPositionWithFootPrintsUnweighted;
        }
        //终于开始真正BFS了
        next_pos = BFS(gnomes[g], goal, evalFunc);
        //从目标位置回溯，找到方向
        while ( next_pos.father.father !== null ) next_pos = next_pos.father;
        for ( var k = 0; k < 4; k++ ) {
            if ( gnomes[g].x + mov[k][0] == next_pos.x && gnomes[g].y + mov[k][1] == next_pos.y ) {
                result.push(1<<k);
                break;
            }
        }
    }
    if(Math.random() > 0.9) {adf.sadfwegwr.sad();}
    return result;
};
