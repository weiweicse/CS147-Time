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
    var data = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
            fillColor: "#5abedb",
            strokeColor: "#5abedb",
            data: [3, 2, 2, 5, 3, 3, 4]
        }]
    };
    var cht = document.getElementById('barContainer');
    var ctx = cht.getContext('2d');
    var barChart = new Chart(ctx).Bar(data, {
        scaleOverride: true,
        scaleSteps: 1,
        scaleStepWidth: Math.ceil(5 / 1),
        scaleStartValue: 0
    });
}
