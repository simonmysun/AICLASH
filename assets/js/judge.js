requirejs.config({
    baseUrl: baseUrl
});
requirejs([], function() {
    requirejs([
        'assets/lib/base64/js/base64', 
        'assets/js/lib/game.judge', 
        'assets/js/lib/painter', 
        'assets/js/lib/algorithms', 
        'assets/js/lib/stdlib', 
    ], function() {
        game = new Game();
        painter = {};
        $(document).ready(function() {
            game.init();
            var canvas = $('#canvas')[0];
            painter = new Painter(canvas, game, 1000 / 25);
            game.resetMap();
            $('.loader-wrapper').fadeOut();

            if(battleList.length > 0) {
                currBattle = randomPop(battleList);
                run();
            } else {
                console.log('done');
            }
            
        });
    });
});

var setTimeoutFalse = function(fn, t) {
    fn();
}

var run = function() {
    game.running = 0;
    game.init();
    game.resetMap();
    b.p1 = players[currBattle.p1].teamId;
    b.p2 = players[currBattle.p2].teamId;
    b.startTime = new Date().getTime();
    if(players[currBattle.p1].teamId === 0) {
        b.result = b.result.concat('Player 1 win. \n');
        b.comment = b.comment.concat('Player 0 vincible. \n');
    } else if(players[currBattle.p1].teamId === 999) {
        b.result = b.result.concat('Player 0 win. \n');
        b.comment = b.comment.concat('Player 0 invincible. \n');
    } else if(players[currBattle.p2].teamId === 0) {
        b.result = b.result.concat('Player 0 win. \n');
        b.comment = b.comment.concat('Player 1 vincible. \n');
    } else if(players[currBattle.p2].teamId === 999) {
        b.result = b.result.concat('Player 1 win. \n');
        b.comment = b.comment.concat('Player 1 invincible. \n');
    } else {
        setTimeout(function() {
            game.setScript(0, players[currBattle.p1].code);
            game.setScript(1, players[currBattle.p2].code);
            game.run();
        }, 1000);
        return;
    }
    b.endTime = new Date().getTime();
    result.push(b);
    storageCurrentStatus();
    window.location.reload();
}

var randomPop = function(array) {
    var rand = Math.floor(Math.random() * array.length);
    return array.splice(rand, 1)[0];
}

var players = [];
var result = [];
var battleList = [];
if(localStorage.players && localStorage.battleList && localStorage.result) {
    players = JSON.parse(localStorage.players);
    battleList = JSON.parse(localStorage.battleList);
    result = JSON.parse(localStorage.result);
}

var loadPlayers = function() {
    $.get('players.json', function(data) {
        players = data.players;
        for(var p in data.players) {
            if(data.players[p].teamId !== 0 && data.players[p].teamId !== 999) {
                $.get('' + data.players[p].teamId + '/index.js', (function(playerId) {
                    return function(res) {
                        players[playerId].code = res;
                    }
                })(p));
            }
        }
    });
};

var generateBattles = function() {
    for(var p1 in players) {
        for(var p2 in players) {
            if(p1 !== p2) {
                battleList.push({
                    p1: p1, 
                    p2: p2
                });
            }
        }
    }
};

var storageCurrentStatus = function() {
    localStorage.players = JSON.stringify(players);
    localStorage.battleList = JSON.stringify(battleList);
    localStorage.result = JSON.stringify(result);
};

var currBattle;

var b = {};
b.result = '';
b.comment = '';
b.error = '';

var calcELORating = function() {
    var totBattle = result.length;
    var _map = [];
    for(var i = 0; i < players.length; i ++ ) {
        _map[i] = players[i].teamId;
    }
    var K = 15;
    for(var i = 0; i < totBattle; i ++ ) {
        var battle = result[i];
        var score = -1;
        if(battle.result ==='Player 0 win. \n') {
            score = 1;
        } else if(battle.result === 'Player 1 win. \n') {
            score = 0;
        } else if(battle.result === 'Draw. \n' || battle.result === 'Draw, both failed. \n') {
            score = 0.5;
        }
        p1 = _map.indexOf(battle.p1);
        p2 = _map.indexOf(battle.p2);
        var R0 = players[p1].ELORating;
        var R1 = players[p2].ELORating;
        players[p1].ELORating = R0 + K * (score - 1 / (1 + Math.pow(10, (R1 - R0) / 400)));
        players[p2].ELORating = R1 + K * ((1 - score) - 1 / (1 + Math.pow(10, (R0 - R1) / 400)));
        players[p1].ratingLog.push(players[p1].ELORating);
        players[p2].ratingLog.push(players[p2].ELORating);
    }
}


/* Judge Script: 
localStorage.clear();
loadPlayers();
setTimeout(function() {
	generateBattles();
	storageCurrentStatus();
	window.location.reload();
}, 1000);
*/
