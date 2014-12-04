var game = new Game();
var painter;

$(document).ready(function() {
    var editors = [ace.edit("editor0"), ace.edit("editor1")];
    editors[0].setTheme("ace/theme/monokai");
    editors[0].getSession().setMode("ace/mode/javascript");
    editors[1].setTheme("ace/theme/monokai");
    editors[1].getSession().setMode("ace/mode/javascript");
    var canvas = $('#canvas')[0];
    game.init();
    painter = new Painter(canvas, game, 1000 / 25);
    $('#code-editor-btn').click(function() {
        $('#code-editor-wrap').toggleClass('code-editor-visible');
        $(this).find('span').toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-up');
    });
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
                running = 0;
                game.resetWorkers();
                game.run();
            }
            $(this).toggleClass('btn-success').toggleClass('btn-danger').find('span').toggleClass('glyphicon-play').toggleClass('glyphicon-stop');        }
    });
    var gui = new dat.GUI();
    gui.add(game, 'width');
    gui.add(game, 'height');
    gui.add(game, 'reset');
    gui.add(game, 'pause');
    gui.add(painter, 'delay');
});
