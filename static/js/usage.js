$(function() {
    // boilerplate function
    function getTasks() {
        var tasks = [
            {
                name: 'Clean House',
                minutes: 100,
                color: '#F38630'
            },
            {
                name: 'CS147',
                minutes: 200,
                color: '#E0E4CC'
            },
            {
                name: 'Feed Cat',
                minutes: 400,
                color: '#69D2E7'
            }
        ];

        return tasks;
    }

    var tasks = getTasks();
    var data = tasks.map(function(t) {
        return {
            value: t.minutes,
            color: t.color
        };
    });

    var $chart = $('#pie-chart');
    var width = $chart.closest('.container').width();
    $chart.attr('width', width).attr('height', width);

    var ctx = $chart[0].getContext('2d');
    var chart = new Chart(ctx).Pie(data);

    var $legend = $('#task-legends');
    tasks.map(function(t) {
        $legend.append('<li><button type="button" class="btn btn-xs" style="color:rgba(0,0,0,0);background-color:' + t.color + ';">X</button>' + t. name + '</li>');
    });
});
