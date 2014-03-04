(function(window, undefined) {
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
}).call(this);
