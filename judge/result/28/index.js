

var gnomeDir = [];
var ifFirstMove = true;
function point()
{
    x:0;
    y:0;
}

function mycheck(game,src,dir,ene,vis)
{
    var direction=[1,2,4,8];
    var back=[4,8,1,2];
    var dirx=[0,1,0,-1];
    var diry=[-1,0,1,0];
    var tmp=new point();
    var backid;
    var dis=1;

    for(var i=0;i<4;i++)
    {
        if(dir===direction[i])
        {
            tmp.x=src.x+dirx[i];
            tmp.y=src.y+diry[i];
            backid=i;
        }
    }
    while(dis<=vis)
    {
        if((tmp.x===ene.x)&&(tmp.y===ene.y))
        {
            return true;
        }
        if(tmp.x===0&&tmp.y===74)
        {
            return true;
        }
         if(tmp.x===99&&tmp.y===0)
        {
            return true;
        }
        var sum=0;
        var j=0;
        for(var i=0;i<4;i++)
        {
            if( ((game.map.data[tmp.x][tmp.y]&direction[i])>0) &&(direction[i]!==back[backid]))
            {
                sum=sum+1;
                j=i;
            }
        }
        if(sum>1)
        {
            return true;
        }
        if(sum===1)
        {
            tmp.x=tmp.x+dirx[j];
            tmp.y=tmp.y+diry[j];
            dis=dis+1;
            backid=j;

        }
        if(sum===0)
        {
            return false;
        }
    }
    return true;

}

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
var endpoint=new point();

onMyTurn = function(game) {



    if(ifFirstMove) {
        ifFirstMove = false;
        if(game.gnomes[0].x === 0) {
            gnomeDir[0] = 2;
            gnomeDir[1] = 4;
            endpoint.x=game.width-1;
            endpoint.y=game.height-1;
        } else {
            gnomeDir[0] = 1;
            gnomeDir[1] = 8;
            endpoint.x=0;
            endpoint.y=0;
        }
    }

   /*
    if(game.gnomes[0].x===endpoint.x&&game.gnomes[0].y===endpoint.y)
    {
        console.log("win");
    }
    if(game.gnomes[1].x===endpoint.x&&game.gnomes[1].y===endpoint.y)
    {
         console.log("win");
    }
    */

    var action = [];
    gnomeDir[0] = turnRight(gnomeDir[0]);
    while((check(game, game.gnomes[0], gnomeDir[0]) !== true) || (mycheck(game,game.gnomes[0],gnomeDir[0],endpoint,game.gnomes[0].vision)!==true)) {
        gnomeDir[0] = turnLeft(gnomeDir[0]);
    }
    action[0] = gnomeDir[0];
    gnomeDir[1] = turnLeft(gnomeDir[1]);
    while((check(game, game.gnomes[1], gnomeDir[1]) !== true)|| (mycheck(game,game.gnomes[1],gnomeDir[1],endpoint,game.gnomes[1].vision)!==true)){
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





