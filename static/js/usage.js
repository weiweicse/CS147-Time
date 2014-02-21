$(function() {
    $.stayInWebApp();
    // boilerplate function
    // currently generates random tasks
    function getTasks() {
        var tasks = [
            {
                name: 'Clean House',
                minutes: Math.random()*100,
                color: '#F38630'
            },
            {
                name: 'CS147',
                minutes: Math.random()*400,
                color: '#E0E4CC'
            },
            {
                name: 'Feed Cat',
                minutes: Math.random()*200,
                color: '#69D2E7'
            }
        ];

        return tasks;
    }

    var $chart = $('#pie-chart');
    var $legend = $('#task-legends');
    var chart_options = {
        animationSteps: 20,
        animationEasing: 'easeInCubic'
    };

    function updateGraph(tasks) {
        console.log(tasks);
        var data = tasks.map(function(t) {
            return {
                value: t.minutes,
                color: t.color
            };
        });
        console.log('after');
        console.log(data);

        var width = $chart.closest('.container').width();
        $chart.attr('width', width).attr('height', width);

        var ctx = $chart[0].getContext('2d');
        var chart = new Chart(ctx).Pie(data, chart_options);

        $legend.fadeOut().promise().done(function() {
            $legend.html('');

            tasks.map(function(t) {
                $legend.append('<li><button type="button" class="btn btn-xs" style="color:rgba(0,0,0,0);background-color:' + t.color + ';">X</button>' + t. name + '</li>');
            });

            $legend.fadeIn();
        });
    }

    var $toggler = $('#view-toggler');
    $toggler.on('click', 'span', function() {
        // do not re-draw on active item
        var $active_item = $toggler.find('.active');
        if ($active_item.find('span')[0] === this) return;

        $active_item.removeClass('active');
        $(this).closest('div').addClass('active');
        var duration = 1;
        if ($(this).hasClass('day')) {
            duration = 1;
        } else if ($(this).hasClass('week')) {
            duration = 7;
        } else if ($(this).hasClass('month')) {
            duration = 30;
        }

        // use json api to populate data
        $.get('/api/usage/by/' + duration, function(data) {
            console.log('data:\n' + data);
            updateGraph(data);
        });
    });

    // manually trigger a click to show daily view
    $toggler.find('span').first().click();
});
