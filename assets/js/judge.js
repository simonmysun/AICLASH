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
            $('#btn-run').click(function() {
                if(game.wait == 0) {
                    runNext();
                    $(this).toggleClass('btn-success').toggleClass('btn-danger').toggleClass('text-stop').toggleClass('text-run').find('span').toggleClass('glyphicon-play').toggleClass('glyphicon-stop');
                }
            });
            $('.loader-wrapper').fadeOut();
        });
    });
});

var setTimeoutFalse = function(fn, t) {
    fn();
}

var runNext = function() {
    game.running = 0;
    game.init();
    game.resetMap();
    setTimeout(function() {
        game.setScript(0, playerScripts.pop());
        game.setScript(1, playerScripts.pop());
        game.run();
    }, 1000);
}

var result = [];

playerScripts = ['', ''];
