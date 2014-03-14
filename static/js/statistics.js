$(function() {
    $.get('/api/stats', function(data) {
        if (data.days > 100) {
            $('#days').text(18);
        } else {
            $('#days').text(data.days);
        }
        $('#tasks').text(data.tasks);
        $('#hours').text(data.hours);
    });
});
