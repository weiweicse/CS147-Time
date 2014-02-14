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
    var $clock = $('.clock');
    var $greeting = $('.greeting');
    
    var updateScreen = function() {
        var now = new Date();
        $clock.text(now.toTimeString().substr(0, 8));
        
        var time = now.getHours() < 11 ? 'morning' : (now.getHours() < 17 ? 'afternoon' : 'evening');
        var name = $greeting.data('username');
        $greeting.text('Good ' + time + ', ' + name + '!');
    };
    
    var showProgress = function(obj, x, y) {
        obj.css('width', x / y * 100 + '%');
    };
    
    var updateProgress = function() {
        var now = new Date();
        showProgress($("#today"), now.getHours(), 24);
        showProgress($("#week"), now.getDay(), 7);
        showProgress($("#month"), now.getDate() - 1, new Date(now.getYear(), now.getMonth() + 1, 0).getDate());
        showProgress($("#year"), now.getMonth(), 12);
    };
    
    updateScreen();
    updateProgress();
    
    setInterval(updateProgress, 60000);    
    setInterval(updateScreen, 1000);
});
