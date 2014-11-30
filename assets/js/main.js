var game = new Game();
var painter;

$(document).ready(function() {
    var editor = ace.edit("code-editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    //console.log(editor.getValue());
    var canvas = $('#canvas')[0];
    painter = new Painter(canvas, game, 1000 / 25);
});
