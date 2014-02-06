$(function() {
    // Success message
    if (location.search === '?success') {
        // TODO: more robust query test
        var $msg = $('#success-msg');
        var height = $msg.outerHeight();
        $msg.css('top', -height).show().animate({top: 0});
        setTimeout(function() {
            $msg.animate({top: -height});
        }, 2000);
    }

    // Time update
    var $clock = $('.clock');
    var $greeting = $('.greeting');
    
    var updateScreen = function() {
        var now = new Date();
        $clock.text(now.toTimeString().substr(0, 8));
        
        var time = now.getHours() < 11 ? 'morning' : (now.getHours() < 17 ? 'afternoon' : 'evening');
        var name = 'John';
        $greeting.text('Good ' + time + ', ' + name + '!');
    };
    
    var showProgress = function(obj, x, y) {
        obj.css('width', x / y * 100 + '%');
    };
    
    var updateProgress = function() {
        var now = new Date();
        showProgress($("#today"), now.getHours() + 1, 24);
        showProgress($("#week"), now.getDay() + 1, 7);
        showProgress($("#month"), now.getDate(), new Date(now.getYear(), now.getMonth() + 1, 0).getDate());
        showProgress($("#year"), now.getMonth() + 1, 12);
    };
    
    updateScreen();
    updateProgress();
    
    setInterval(updateProgress, 60000);    
    setInterval(updateScreen, 1000);

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
});
