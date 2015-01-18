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
var followingWall = [];followingWall[0]=false;followingWall[1]=false;followingWall[2]=false;
var rotation = [];rotation[0]=0;rotation[1]=0;rotation[2]=0;
var going = [];going[0] = 2;going[1] = 4;going[2] = 4;
onMyTurn = function(game) {
   function mydir(i){
       if (followingWall[i] && rotation[i] === 0) {
           followingWall[i] = false;
       }
       if (!followingWall[i]) {
           if (check(game, game.gnomes[i], going[i])) {
               return going[i];
           }else {
               followingWall[i]=true;
               going[i] = turnRight(going[i]);
               rotation[i]++;
           }
       }
       if(check(game,game.gnomes[i],turnLeft(going[i]))) {
           going[i] = turnLeft(going[i]);
           rotation[i]--;
           return going[i];
       }else {
           while(!check(game,game.gnomes[i],going[i])) {
               going[i] = turnRight(going[i]);
               rotation[i]++;
           }
           return going[i];
       }
   }
   going[0] = mydir(0);
   going[1] = mydir(1);
   going[2] = mydir(2);
  
   return going;
};
