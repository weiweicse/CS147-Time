(function(window, undefined) {
    // Set up help
    var viewport_width = $(window).width();
    var viewport_height = $(window).height();
    var $panel = $('#help-panel').css('width', viewport_width*0.8);
    // show it outside viewport to get proper height
    $panel.css('left', viewport_width*0.1).css('top', -9999).show();
    var top = (viewport_height - $panel.outerHeight()) / 2;
    $panel.hide().css('top', top);

    $('#help a').on('click', function(e) {
        e.preventDefault();
        $panel.fadeIn();
    });

    $panel.on('click', '.panel-title', function() {
        $panel.fadeOut();
    });
})(this);
