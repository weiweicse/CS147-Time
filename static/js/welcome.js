(function(window, undefined) {
    // http://stackoverflow.com/a/8876069/1240620
    var viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if (viewport_height < 500)
        // optimize for iPhone 4
        $('figure').css('max-height', '350px');

    Swipe = Swipe(document.getElementById('slider'), {
        auto: 2000
    });
})(this);
