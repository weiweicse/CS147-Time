$(function() {
    $.get('/api/stats', function(data) {
        $('#days').text(data.days);
        $('#tasks').text(data.tasks);
        $('#hours').text(data.hours);
    });
});
