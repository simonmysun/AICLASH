function Game() {
    this.map = [];
    for(var i = 0; i < 400; i ++ ) {
        this.map[i] = [];
        for(var j = 0; j < 300; j ++ ) {
            this.map[i][j] = {
                data: 9,
                visited: [0, 0]
            }
        }
    }
    return 0;
}

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

    $()
    $.getScript('../assets/js/lib/paint.js', function() {
        var canvas = $('#canvas');
        var context = canvas[0].getContext('2d');
        paint(context, game.map, 1000 / 60);
    });
});


