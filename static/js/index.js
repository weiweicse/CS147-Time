$(function() {
    // Success message
    if (location.search === '?success') {
        // TODO: more robust query test
        var $msg = $('#success-msg');
        var height = $msg.outerHeight();
        /*
         * Note: animate from bottom instead from top (which is more
         *       idiomatic in iOS native apps) because the status bar
         *       text seems always on top.
         */
        $msg.css('bottom', -height).show().animate({bottom: 0});
        setTimeout(function() {
            $msg.animate({bottom: -height});
        }, 2000);
    }

    // Time update
    var $greeting = $('.greeting');
    
    var updateScreen = function() {
        var now = new Date();

        var time = now.getHours() < 11 ? 'morning' : (now.getHours() < 17 ? 'afternoon' : 'evening');
        var name = $greeting.data('username');
        $greeting.text('Good ' + time + ', ' + name + '!');
    };
    
    updateScreen();
    
    // update every 15 minutes
    setInterval(updateScreen, 1000*60*15);
});
