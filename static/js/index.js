$(function() {
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
});
