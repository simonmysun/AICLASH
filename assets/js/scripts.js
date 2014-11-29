var game = new Game();

$(document).ready(function() {
    $('#menu-btn,#menu-wrap').click(function() {
        $('#menu-wrap').fadeToggle();
    });
    $('#code-editor-btn').click(function() {
        $('#code-editor-wrap').toggleClass('code-editor-visible');
        $('#code-editor-btn').find('span').toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-up');
    });
    var editor = ace.edit("code-editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    //console.log(editor.getValue());
    var canvas = $('#canvas')[0];
    paint(canvas, game, 1000 / 25);
});


