$(document).ready(function() {
    var c = $("#barContainer");
    var ct = c.get(0).getContext('2d');
    var container = $(c).parent();
    $(window).resize(resizeCanvas);
    function resizeCanvas() {
        c.attr('width', $(container).width());
        c.attr('height', $(container).height());
        createChart();
    }
    resizeCanvas();
});

function createChart() {
    // get current time
    var now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    // set data
    var data = {};
    data.labels = [];
    // init labels
    var starttime = new Date();
    starttime.setDate(now.getDate() - 29);
    var cnt = 0;
    for (var d = starttime; d <= now; d.setDate(d.getDate() + 1)) {
        if (cnt % 5 === 0) {
            data.labels.push(d.toString().substring(3,10));
        } else {
            data.labels.push("  ");
        }
        cnt++;
    }
    console.log(data.labels);
    data.datasets = [{}];
    data.datasets[0].fillColor = "#5abedb";
    data.datasets[0].strokeColor = "#5abedb";
    data.datasets[0].data = [];
    // get data from json api
    $.get('/api/trend', function(d) {
        console.log(data);
        data.datasets[0].data = d;
        var cht = document.getElementById('barContainer');
        var ctx = cht.getContext('2d');
        var ymax = Math.max.apply(Math, data.datasets[0].data);
        console.log("ymax: " + ymax);
        var barChart = new Chart(ctx).Bar(data, {
            scaleOverride: true,
            scaleSteps: 10,
            scaleStepWidth: ymax / 10,
            scaleStartValue: 0,
            barValueSpacing: 0
        });
    });
}
