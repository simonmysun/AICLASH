---
layout: page
title: 文档：36 队
---

### 算法设计思路：

地精在当前点的决策，取决于使用A*算法所找到的能够让地精走出当前视野的最短路。
单靠A*算法寻路，测试时出现过地精在一段路上不断往返的情况。对此我们采取的解决方案是若地精在某一点重复经过多次，则会根据它经过的次数让其改变策略走向（BUFF或者终点）。

### A*算法思路：

1. 将开始节点放入开放列表(开始节点的F和G值都视为0);
1. 重复一下步骤:
    1. 在开放列表中查找具有最小F值的节点,并把查找到的节点作为当前节点;
    1. 把当前节点从开放列表删除, 加入到封闭列表;
    1. 对当前节点相邻的每一个节点依次执行以下步骤:
        1. 如果该相邻节点不可通行或者该相邻节点已经在封闭列表中,则什么操作也不执行,继续检验                   下一个节点;
        1. 如果该相邻节点不在开放列表中,则将该节点添加到开放列表中, 并将该相邻节点的父节点设为当前节点,同时保存该相邻节点的G和F值;
        1. 如果该相邻节点在开放列表中, 则判断若经由当前节点到达该相邻节点的G值是否小于原来保存的G值,若小于,则将该相邻节点的父节点设为当前节点,并重新设置该相邻节点的G和F值.
    1. 循环结束条件:
        * 当终点节点被加入到开放列表作为待检验节点时, 表示路径被找到,此时应终止循环;
        * 或者当开放列表为空,表明已无可以添加的新节点,而已检验的节点中没有终点节点则意味着路径无法被找到,此时也结束循环;
1. 从终点节点开始沿父节点遍历, 并保存整个遍历到的节点坐标,遍历所得的节点就是最后得到的路径;



核心代码：A*算法求最短路，用以寻找地精从当前点到目标点的最短路

```

function A(array, start, end, vision, height, width, huha,gno){
/*
参数array是一个数组，表示地精当前所能看到的视野范围
Start、end、vision、height、width、huha、gno分别表示起点、终点、视野、地图高度、地图宽度、路径连通标志位、地精参数
*/

    var MAX = 100*75 + 1;
    var x_length = width;
    var y_length = height;
    var father = [];
    var visit = [];
    var open = [];

    open.push({x:start.x, y:start.y});//将起点放入开放列表
    var G = [];
    var i;
    var j;
    for(i = 0; i < x_length+1; i ++){
        var v = [];
        var g = [];
        var f = [];
        for(j = 0; j < y_length+1; j++){
            f.push({fx:-1,fy:-1});
            if(i === start.x && j === start.y){
                g[j] = 0; 
                v[j] = 1;//
            }
           
             else
            {
                g[j] = MAX;
                v[j] = 0;//            
	        }
            
        }
        father[i] = f;
        G[i] = g;
        visit[i] = v;
    }//初始化

    var lololist={x:start.x,y:start.y};
    var min = {x:start.x, y:start.y};
    var success = true;
    var end0 = {x:end.x, y:end.y};
    while(true){
		if(huha === true && visit[end.x][end.y] !== 0){
            break;
        }//终点结点被加入到开放列表中，终止循环
        else if(huha === true && open.length === 0){
            success = false;
            break;
        }        else if(huha === false && open.length === 0){
		    end0.x=lololist.x;end0.y=lololist.y;break;
        }//开放列表为空，路径未找到，终止循环

        

        var fmin = MAX*2;
        var temp;
        var flag;
        for(i = 0; i < open.length; i++){
            temp = G[open[i].x][open[i].y] + Math.abs(end0.x - open[i].x) + Math.abs(end0.y - open[i].y);
            if(temp < fmin){
                fmin = temp;
                flag = i;
            }
        }

        
        min.x = open[flag].x;
        min.y = open[flag].y;

        open.splice(flag,1);
        visit[min.x][min.y] = 2;       

		var result = [];
		var t;
		    if(min.x-1>0&&min.x-1<2*vision+1){
            if(array[min.x-1][min.y]!=-2){
                        
			t = array[min.x][min.y] & 8; 
			if(t > 0){
				result.push([min.x-1, min.y]);
			
                    	}
			
		}
		    }   
		    if(min.y+1>0&&min.y+1<2*vision+1){
			if(array[min.x][min.y+1]!=-2){
			t = array[min.x][min.y] & 4; 
			if(t > 0){
				result.push([min.x, min.y+1]);
			
			}
			
		}
		    }
		    if(min.x+1>0&&min.x+1<2*vision+1){
			if(array[min.x+1][min.y]!=-2){
			t = array[min.x][min.y] & 2; 
			if(t > 0){
				result.push([min.x+1, min.y]);
			}
			
			
		}
		    }
		    if(min.y-1>0&&min.y-1<2*vision+1){
			if(array[min.x][min.y-1]!=-2){
			t = array[min.x][min.y] & 1; 
			if(t > 0){
				result.push([min.x, min.y-1]);
			}
		}
		    }

//依次检验当前点的四个相邻结点是否能够放入开放列表中
         var lolo =true;
         
        for(j = 0; j < result.length; j ++){
			var xx = result[j][0];
			var yy = result[j][1];
			if(visit[xx][yy] == 1){
				if(G[min.x][min.y]+1 < G[xx][yy]){
					father[xx][yy] = {fx:min.x, fy:min.y};
					G[xx][yy] = G[min.x][min.y] + 1;
				}//若经由当前结点到达该相邻结点的G值小于原本保存的G值，该相邻				 //结点的父亲结点置为当前结点
			}

			if(visit[xx][yy] === 0 && Math.abs(xx-start.x)+Math.abs(yy-start.y)<=vision){
				father[xx][yy] = {fx:min.x, fy:min.y};
				G[xx][yy] = G[min.x][min.y] + 1;
				open.push({x:xx, y:yy});
				visit[xx][yy] = 1;
			}//if
                        if(array[xx][yy]==-1&&Math.abs(xx-start.x)+Math.abs(yy-start.y)<=vision+1){
                                
                                end0.x=min.x;
                                end0.y=min.y;
                                lolo=false;
                        }
                                 
        }//for
        
        
        if(lolo===false){
            
            var fx1,fy1,fx2,fy2;
            var temp1={};
            temp1.x=end0.x;
            temp1.y=end0.y;
            while(true){
                if(temp1.x===start.x&&temp1.y===start.y){break;}
                fx2=fx1;
                fy2=fy1;
    			fx1 = father[temp1.x][temp1.y].fx;
    			fy1 = father[temp1.x][temp1.y].fy;
    			temp1.x = fx1;
    			temp1.y = fy1;
            }
            if(c[fx2-vision+gno.x][fy2-vision+gno.y]>2 && c[end0.x-vision+gno.x][end0.y-vision+gno.y]<c[lololist.x-vision+gno.x][lololist.y-vision+gno.y]){lololist.x=end0.x;lololist.y=end0.y;}////**********************y y
            if(c[fx2-vision+gno.x][fy2-vision+gno.y]>2){lolo=true;}
        }
        
        
        if(lolo===false)break;
    }
    var road = [];
    if(!success){
        return road;
    }
    else{
		var fx,fy;
        var temp0 = {};
		temp0.x = end0.x;
		temp0.y = end0.y;

        while(true){
			if(temp0.x === start.x && temp0.y === start.y){
				break;
			}
			road.push({x:temp0.x, y:temp0.y});
			fx = father[temp0.x][temp0.y].fx;
			fy = father[temp0.x][temp0.y].fy;
			temp0.x = fx;
			temp0.y = fy;
		}

   		return road;
    }

}

```