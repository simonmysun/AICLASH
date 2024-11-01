function illegal(x, y, height, width) {
	if (x < 0 || y < 0 || x >= width || y >= height) {
		return false;
	}
	else {
		return true;
	}
}

var a = { x: 1, y: 1 };
var target = 0;
var c = [];//c为全局大地图

for (i = 0; i < 100; i++) {
	var b = [];

	for (j = 0; j < 75; j++) { b[j] = 0; }

	c[i] = b;

}


function get(x, y, game, n) {
	var square = [];
	var vision = game.gnomes[n - 1].vision;
	var height = game.height;
	var width = game.width;
	var i, j;
	for (i = 0; i < 2 * game.gnomes[n - 1].vision + 1; i++) {
		var s = [];
		for (j = 0; j < 2 * game.gnomes[n - 1].vision + 1; j++) {
			if (illegal(x - vision + i, y - vision + j, height, width)) {
				if (Math.abs(i - vision) + Math.abs(j - vision) <= vision) {
					s.push(game.map.data[x - vision + i][y - vision + j]);
				}
				else {
					s.push(-1);
				}
			}
			else {
				s.push(-2);
			}
		}
		square[i] = s;
	}
	return square;
}



function A(array, start, end, vision, height, width, huha, gno) {
	var MAX = 100 * 75 + 1;
	var x_length = width;
	var y_length = height;
	var father = [];
	var visit = [];
	var open = [];
	//    var close = [];//close没有实际用处
	open.push({ x: start.x, y: start.y });//
	var G = [];
	var i;
	var j;
	for (i = 0; i < x_length + 1; i++) {
		var v = [];
		var g = [];
		var f = [];
		for (j = 0; j < y_length + 1; j++) {
			f.push({ fx: -1, fy: -1 });
			if (i === start.x && j === start.y) {
				g[j] = 0;
				v[j] = 1;//
			}

			else {
				g[j] = MAX;
				v[j] = 0;//            
			}

		}
		father[i] = f;
		G[i] = g;
		visit[i] = v;
	}

	var lololist = { x: start.x, y: start.y };
	var min = { x: start.x, y: start.y };
	var success = true;
	var end0 = { x: end.x, y: end.y };
	while (true) {
		if (huha === true && visit[end.x][end.y] !== 0) {
			break;
		}
		else if (huha === true && open.length === 0) {
			success = false;
			break;
		}
		else if (huha === false && open.length === 0) {
			end0.x = lololist.x; end0.y = lololist.y; break;
		}


		var fmin = MAX * 2;
		var temp;
		var flag;
		for (i = 0; i < open.length; i++) {
			temp = G[open[i].x][open[i].y] + Math.abs(end0.x - open[i].x) + Math.abs(end0.y - open[i].y);
			if (temp < fmin) {
				fmin = temp;
				flag = i;
			}
		}


		min.x = open[flag].x;
		min.y = open[flag].y;

		open.splice(flag, 1);
		visit[min.x][min.y] = 2;

		var result = [];
		var t;
		if (min.x - 1 > 0 && min.x - 1 < 2 * vision + 1) {
			if (array[min.x - 1][min.y] != -2) {

				t = array[min.x][min.y] & 8;
				if (t > 0) {
					result.push([min.x - 1, min.y]);

				}

			}
		}
		if (min.y + 1 > 0 && min.y + 1 < 2 * vision + 1) {
			if (array[min.x][min.y + 1] != -2) {
				t = array[min.x][min.y] & 4;
				if (t > 0) {
					result.push([min.x, min.y + 1]);

				}

			}
		}
		if (min.x + 1 > 0 && min.x + 1 < 2 * vision + 1) {
			if (array[min.x + 1][min.y] != -2) {
				t = array[min.x][min.y] & 2;
				if (t > 0) {
					result.push([min.x + 1, min.y]);
				}


			}
		}
		if (min.y - 1 > 0 && min.y - 1 < 2 * vision + 1) {
			if (array[min.x][min.y - 1] != -2) {
				t = array[min.x][min.y] & 1;
				if (t > 0) {
					result.push([min.x, min.y - 1]);

				}

			}
		}
		var lolo = true;

		for (j = 0; j < result.length; j++) {
			var xx = result[j][0];
			var yy = result[j][1];
			if (visit[xx][yy] == 1) {
				if (G[min.x][min.y] + 1 < G[xx][yy]) {
					father[xx][yy] = { fx: min.x, fy: min.y };
					G[xx][yy] = G[min.x][min.y] + 1;
				}
			}

			if (visit[xx][yy] === 0 && Math.abs(xx - start.x) + Math.abs(yy - start.y) <= vision) {
				father[xx][yy] = { fx: min.x, fy: min.y };
				G[xx][yy] = G[min.x][min.y] + 1;
				open.push({ x: xx, y: yy });
				visit[xx][yy] = 1;
			}//if
			if (array[xx][yy] == -1 && Math.abs(xx - start.x) + Math.abs(yy - start.y) <= vision + 1) {

				end0.x = min.x;
				end0.y = min.y;
				lolo = false;
			}

		}//for


		if (lolo === false) {

			var fx1, fy1, fx2, fy2;
			var temp1 = {};
			temp1.x = end0.x;
			temp1.y = end0.y;
			while (true) {
				if (temp1.x === start.x && temp1.y === start.y) { break; }
				fx2 = fx1;
				fy2 = fy1;
				fx1 = father[temp1.x][temp1.y].fx;
				fy1 = father[temp1.x][temp1.y].fy;
				temp1.x = fx1;
				temp1.y = fy1;
			}
			if (c[fx2 - vision + gno.x][fy2 - vision + gno.y] > 2 && c[end0.x - vision + gno.x][end0.y - vision + gno.y] < c[lololist.x - vision + gno.x][lololist.y - vision + gno.y]) { lololist.x = end0.x; lololist.y = end0.y; }////**********************y y
			if (c[fx2 - vision + gno.x][fy2 - vision + gno.y] > 2) { lolo = true; }
		}


		if (lolo === false) break;
	}


	var road = [];
	if (!success) {
		return road;
	}
	else {
		var fx, fy;
		var temp0 = {};
		temp0.x = end0.x;
		temp0.y = end0.y;

		while (true) {
			if (temp0.x === start.x && temp0.y === start.y) {
				break;
			}
			road.push({ x: temp0.x, y: temp0.y });
			fx = father[temp0.x][temp0.y].fx;
			fy = father[temp0.x][temp0.y].fy;
			temp0.x = fx;
			temp0.y = fy;
		}

		return road;
	}

}

var lastvision = 15;
var buf1 = { x: 0, y: 74, flag: false };
var buf2 = { x: 99, y: 0, flag: false };

function flash(x, y, vision) {
	for (var i = x - vision; i <= x + vision; i++) {
		for (var j = y - vision; j <= y + vision; j++) {
			if (illegal(i, j, 100, 75)) {
				c[i][j] = 0;
			}
		}
	}
	target = 0;
}
var first = true;
var self = {};
var other = {};
var save = [];

function onMyTurn(game) {
	if (first === true) {
		if (game.gnomes[0].x === 0 && game.gnomes[0].y === 0) {
			self.x = 0;
			self.y = 0;
			other.x = 99;
			other.y = 74;
		}
		else {
			self.x = 99;
			self.y = 74;
			other.x = 0;
			other.y = 0;
		}
		first = false;
	}
	var action = [2, 2, 2];
	var v = get(game.gnomes[0].x, game.gnomes[0].y, game, 1);
	if (lastvision != game.gnomes[0].vision) {
		if (c[buf1.x][buf1.y] > 0 && buf1.flag !== true) {
			buf1.flag = true;
		}
		if (c[buf2.x][buf2.y] > 0 && buf2.flag !== true) {
			buf2.flag = true;
		}

		for (i = 0; i < 100; i++) {
			b = [];

			for (j = 0; j < 75; j++) { b[j] = 0; }


			c[i] = b;

		}
		lastvision = game.gnomes[0].vision; target = 0;
	}

	var flag, flag1, flag2, flag3;
	if (Math.abs(game.gnomes[0].x - other.x) + Math.abs(game.gnomes[0].y - other.y) <= game.gnomes[0].vision) {
		flag = true;
	}
	else {
		flag = false;
	}

	if (Math.abs(game.gnomes[0].x - 0) + Math.abs(game.gnomes[0].y - 74) <= game.gnomes[0].vision) {
		flag1 = true;
	}
	else {
		flag1 = false;
	}

	if (Math.abs(game.gnomes[0].x - 99) + Math.abs(game.gnomes[0].y - 0) <= game.gnomes[0].vision) {
		flag2 = true;
	}
	else {
		flag2 = false;
	}

	if (Math.abs(game.gnomes[0].x - self.x) + Math.abs(game.gnomes[0].y - self.y) <= game.gnomes[0].vision) {
		flag3 = true;
	}
	else {
		flag3 = false;
	}


	var road;
	var temp = {};
	if (buf1.flag !== true && buf2.flag !== true) {
		if (target % 10 === 0 || flag === true || target % 10 === 2 || target % 10 === 5) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: other.x - game.gnomes[0].x + game.gnomes[0].vision, y: other.y - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,

				flag, game.gnomes[0]);
		}

		else if (target % 10 === 1 || target % 10 === 3 || target % 10 === 7) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: 0 - game.gnomes[0].x + game.gnomes[0].vision, y: 74 - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,
				flag1, game.gnomes[0]);
		}
		else if (target % 10 === 4 || target % 10 === 6 || target % 10 === 8) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: 99 - game.gnomes[0].x + game.gnomes[0].vision, y: 0 - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,
				flag2, game.gnomes[0]);
		}
		else if (target % 10 === 9) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: self.x - game.gnomes[0].x + game.gnomes[0].vision, y: self.y - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,
				flag3, game.gnomes[0]);
		}
	}


	else if ((buf1.flag !== true && buf2.flag === true)) {//|| (game.visited[buf2.x][buf2.y] > 0 && buf2.flag !== true)){

		if (target % 10 === 0 || flag === true || target % 10 === 4 || target % 10 === 6 || target % 10 === 2) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: other.x - game.gnomes[0].x + game.gnomes[0].vision, y: other.y - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,

				flag, game.gnomes[0]);
		}

		else if (target % 10 === 1 || target % 10 === 3 || target % 10 === 8) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: 0 - game.gnomes[0].x + game.gnomes[0].vision, y: 74 - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,
				flag1, game.gnomes[0]);
		}
		else if (target % 10 === 7 || target % 10 === 9) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: 99 - game.gnomes[0].x + game.gnomes[0].vision, y: 0 - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,
				flag2, game.gnomes[0]);
		}
		else if (target % 10 === 5) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: self.x - game.gnomes[0].x + game.gnomes[0].vision, y: self.y - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,
				flag3, game.gnomes[0]);
		}


	}


	else if ((buf1.flag === true && buf2.flag !== true)) {//|| (game.visited[buf1.x][buf1.y] > 0 && buf1.flag !== true)){

		if (target % 10 === 0 || flag === true || target % 10 === 2 || target % 10 === 4 || target % 10 === 6) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: other.x - game.gnomes[0].x + game.gnomes[0].vision, y: other.y - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,

				flag, game.gnomes[0]);
		}

		else if (target % 10 === 7 || target % 10 === 9) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: 0 - game.gnomes[0].x + game.gnomes[0].vision, y: 74 - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,
				flag1, game.gnomes[0]);
		}
		else if (target % 10 === 1 || target % 10 === 3 || target % 10 === 8) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: 99 - game.gnomes[0].x + game.gnomes[0].vision, y: 0 - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,
				flag2, game.gnomes[0]);
		}
		else if (target % 10 === 5) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: self.x - game.gnomes[0].x + game.gnomes[0].vision, y: self.y - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,
				flag3, game.gnomes[0]);
		}

	}


	else if (buf1.flag === true && buf2.flag === true) {

		if (target % 10 === 0 || flag === true || target % 10 === 2 || target % 10 === 4 || target % 10 === 6 || target % 10 === 8) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: other.x - game.gnomes[0].x + game.gnomes[0].vision, y: other.y - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,

				flag, game.gnomes[0]);
		}

		else if (target % 10 === 1 || target % 10 === 5) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: 0 - game.gnomes[0].x + game.gnomes[0].vision, y: 74 - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,
				flag1, game.gnomes[0]);
		}
		else if (target % 10 === 3 || target % 10 === 7) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: 99 - game.gnomes[0].x + game.gnomes[0].vision, y: 0 - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,
				flag2, game.gnomes[0]);
		}
		else if (target % 10 === 9) {
			road = A(v, { x: game.gnomes[0].vision, y: game.gnomes[0].vision }, { x: self.x - game.gnomes[0].x + game.gnomes[0].vision, y: self.y - game.gnomes[0].y + game.gnomes[0].vision }, game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision, 1 + 2 * game.gnomes[0].vision,
				flag3, game.gnomes[0]);
		}

	}



	if (road.length > 0) {
		a = {};
		var next = {};
		next.x = road[road.length - 1].x;
		next.y = road[road.length - 1].y;
		if (next.x == game.gnomes[0].vision - 1) {
			action[0] = 8; a.x = game.gnomes[0].x - 1; a.y = game.gnomes[0].y; c[a.x][a.y]++;
		}
		if (next.x == game.gnomes[0].vision + 1) {
			action[0] = 2; a.x = game.gnomes[0].x + 1; a.y = game.gnomes[0].y; c[a.x][a.y]++;
		}
		if (next.y == game.gnomes[0].vision - 1) {
			action[0] = 1; a.x = game.gnomes[0].x; a.y = game.gnomes[0].y - 1; c[a.x][a.y]++;
		}
		if (next.y == game.gnomes[0].vision + 1) {
			action[0] = 4; a.x = game.gnomes[0].x; a.y = game.gnomes[0].y + 1; c[a.x][a.y]++;
		}
		if (c[a.x][a.y] % 4 == 3) target++;
		if (c[a.x][a.y] >= 10) {
			flash(a.x, a.y, game.gnomes[0].vision);
		}

	}

	return action;

}
