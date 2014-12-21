$(document).ready(function() {
    $('#menu-btn,#menu-wrap').click(function() {
        $('#menu-wrap').fadeToggle();
    });
    if(typeof requirejs !== 'function') {
        $('.homepage-next').click(function() {
            $('body').clearQueue().stop().animate({scrollTop: $(this).next().position().top}, 500);
        });
        $('.loader-wrapper').fadeOut();
    }
    
});
