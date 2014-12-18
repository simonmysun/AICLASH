$(document).ready(function() {
    $('#menu-btn,#menu-wrap').click(function() {
        $('#menu-wrap').fadeToggle();
    });
    if(typeof requirejs !== 'object') {
        $('.homepage-next').click(function() {
            $('body').animate({scrollTop: $(this).next().position().top});
        });
        $('.loader-wrapper').fadeOut();
    }
});
