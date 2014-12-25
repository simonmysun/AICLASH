requirejs.config({
    baseUrl: baseUrl
});
requirejs([], function() {
    requirejs([
        'assets/lib/ace-builds/ace', 
        'assets/lib/dat.gui/js/dat.gui.min', 
        'assets/lib/base64/js/base64', 
        'assets/lib/stat.js/js/stats.min', 
        'assets/js/lib/game.main', 
        'assets/js/lib/painter', 
        'assets/js/lib/algorithms', 
        'assets/js/lib/stdlib'
    ], function() {
        game = new Game();
        painter = {};
        stats = new Stats();
        
        $(document).ready(function() {
            var editors = [ace.edit('editor0'), ace.edit('editor1')];
            contentRecover(editors);
            game.init();
            var canvas = $('#canvas')[0];
            painter = new Painter(canvas, game, 1000 / 25);
            game.resetMap();
            $('#code-editor-btn').click(function() {
                $('#code-editor-wrap').toggleClass('code-editor-visible');
                $(this).find('span').toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-up');
            });
            setTimeout(function() {
                $('#code-editor-wrap').toggleClass('code-editor-visible');
                $(this).find('span').toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-up');
            }, 500);
            $('#tabs>ul>li').click(function() {
                $('#code-editors').animate({'left': (- parseInt($(this).attr('data-editor')) * 100) + '%'});
                $('#tabs>ul>li').removeClass('active');
                $(this).addClass('active');
            });
            $('#btn-run').click(function() {
                if(game.wait == 0) {
                    if(game.running === 0) {
                        game.setScript(0, editors[0].getValue());
                        game.setScript(1, editors[1].getValue());
                        game.run();
                    } else {
                        game.running = 0;
                        game.init();
                        game.resetMap();
                    }
                    $(this).toggleClass('btn-success').toggleClass('btn-danger').toggleClass('text-stop').toggleClass('text-run').find('span').toggleClass('glyphicon-play').toggleClass('glyphicon-stop');
                }
            });
            var gui = new dat.GUI();
            gui.add(game, 'width');
            gui.add(game, 'height');
            gui.add(game, 'resetMap');
            gui.add(game, 'pause');
            gui.add(painter, 'delay');
            stats.setMode(1); 
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.right = '0px';
            stats.domElement.style.bottom = '0px';
            document.body.appendChild( stats.domElement );
            $('.loader-wrapper').fadeOut();
        });
    });
});

var contentRecover = function(editors) {
    for(var i = 0; i < 2; i ++ ) {
        editors[i].setTheme('ace/theme/monokai');
        editors[i].getSession().setMode('ace/mode/javascript');
        editors[i].on('change', function(e) {
            var code = [];
            for(var j = 0; j < 2; j ++ ) {
                code.push(editors[j].getValue());
            }
            document.location.hash = Base64.encode(code.join('\x7f'));
            if(typeof(Storage) !== 'undefined') {
                localStorage.setItem('editorContent-' + i, code[i]);
            }
        });
    }
    if(document.location.hash.length > 0) {
        var urlStorage = Base64.decode(unescape((location).hash)).split("\x7F")||"";
        for(var i = 0; i < 2; i ++ ) {
            editors[i].setValue(urlStorage[i]);
        }
    } else if(typeof(Storage) !== 'undefined') {
        for(var i = 0; i < 2; i ++ ) {
            var code = localStorage.getItem('editorContent-' + i);
            if(typeof code === 'string') {
                editors[i].setValue(code);
            }
        }
    }
}

