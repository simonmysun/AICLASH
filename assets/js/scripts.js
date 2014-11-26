$(document).ready(function() {
    $('#menu-btn').click(function() {
        $('#menu-wrap').fadeToggle();
    });
    $('#menu-wrap').click(function() {
        $('#menu-wrap').fadeToggle();
    });
    $('#code-editor-btn').click(function() {
        $('#code-editor-wrap').toggleClass('code-editor-visible');
        $('#code-editor-btn').find('span').toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-up');
    });
    var editor = ace.edit("code-editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
});
