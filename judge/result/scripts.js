var players;
var battles;
var battleIndex = [];
var playerIndex = [];

$(document).ready(function () {
    $.get('playerdata', function (res) {
        players = JSON.parse(Base64.decode(res));
        for (var p in players) {
            playerIndex[players[p].teamId] = players[p];
        }
        $.get('battledata', function (res) {
            battles = JSON.parse(Base64.decode(res));
            for (var p in players) {
                battleIndex[players[p].teamId] = [];
            }
            for (var b in battles) {
                battleIndex[battles[b].p1][battles[b].p2] = battles[b];
                battleIndex[battles[b].p1][battles[b].p1] = {};
            }
            var table;
            $('#result').append('<h2>比赛结果</h2>');
            table = '<table class="table table-bordered table-hover table-striped">';
            table += '<tr><th>Player</th><th>Final rating</th><th>AI Code</th><th>Documents</th></tr>';
            for (var i in playerIndex) {
                if (i !== '0' && i !== '999') {
                    var player = playerIndex[i];
                    table += '<tr>';
                    table += '<td>' + i + '</td>';
                    table += '<td>' + player.ELORating + '</td>';
                    table += '<td><a href="' + player.teamId + '/index.js" target="_blank">Code</a></td>';
                    table += '<td><a href="' + player.teamId + '/doc/" target="_blank">Doc</a></td>';
                    table += '</tr>';
                }
            }
            table += '</table>';
            $('#result').append(table);
            $('#result').append('<h2>比赛记录</h2>');
            table = '<table class="table table-bordered table-hover table-striped">';
            table += '<tr><th>#</th>';
            for (var i in battleIndex) {
                if (i !== '0' && i !== '999') {
                    table += '<th><a class="player" data-player="' + i + '">' + i + '</a></th>';
                }
            }
            table += '</tr>';
            for (var i in battleIndex) {
                if (i !== '0' && i !== '999') {
                    table += '<tr>';
                    table += '<td><a class="player" data-player="' + i + '">' + i + '</a></td>';
                    for (var j in battleIndex[i]) {
                        if (j !== '0' && j !== '999') {
                            if (i !== j) {
                                table += '<td><a class="battle" data-p1="' + i + '" data-p2="' + j + '">view</a></td>';
                            }
                            else {
                                table += '<td>-</td>';
                            }
                        }
                    }
                }
                table += '</tr>';
            }
            table += '</table>';
            $('#result').append(table);
            $('.player').click(function () {
                showPlayer($(this).attr('data-player'));
            });
            $('.battle').click(function () {
                showBattle($(this).attr('data-p1'), $(this).attr('data-p2'));
            });
        });
    });
});

function buildModal(title, content) {
    var modal = '<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">' + title + '</h4></div><div class="modal-body">' + content + '</div><div id="chart"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div><!-- /.modal-content --></div><!-- /.modal-dialog --></div><!-- /.modal -->';
    $('body').append(modal);
    $('.modal').modal('show');
    $('.modal').on('hidden.bs.modal', function (e) {
        $('.modal').remove();
    });
};

function showPlayer(p) {
    var player = playerIndex[p];
    buildModal('Player ' + player.teamId, '<h3>Final Rating: ' + player.ELORating + '</h3>');
    $('.modal').on('shown.bs.modal', (function (player) {
        return function () {
            var myChart = echarts.init(document.getElementById('chart'));
            myChart.setOption({
                title: {
                    text: 'Rating',
                    subtext: 'Changes'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['ELO rating']
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: (function () {
                            return function () {
                                var b = [];
                                for (var i in player.ratingLog) {
                                    b[i] = i;
                                }
                                return b;
                            };
                        })()()
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        boundaryGap: [1, 1],
                        scale: true,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: 'ELO rating',
                        type: 'line',
                        data: player.ratingLog
                    }
                ]
            });
        };
    })(player));
};

function showBattle(p1, p2) {
    buildModal('Battle ' + p1 + ' v.s. ' + p2, '<p>Top-left: ' + p1 + ', bottom-right: ' + p2 + '</p><img style="width:100%;height:auto;" src="battles/' + p1 + '-' + p2 + '.png">');
    $('.modal #chart').remove();
};
