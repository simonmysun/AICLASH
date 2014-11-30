var game = new Game();
var painter;

$(document).ready(function() {
    $('#code-editor-btn').click(function() {
        $('#code-editor-wrap').toggleClass('code-editor-visible');
        $('#code-editor-btn').find('span').toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-up');
    });
    var editor = ace.edit("code-editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    //console.log(editor.getValue());
    var canvas = $('#canvas')[0];
    painter = new Painter(canvas, game, 1000 / 25);
});
