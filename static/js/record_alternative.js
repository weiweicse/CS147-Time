$(function() {
    var start = 0;
    var end = 1439;
    $('#datepicker').pickadate();
    $('#starttime').on('slidestop', function(evt) {
        start = $('#starttime').val();
        var minutes = parseInt(start % 60, 10);
        var hours = parseInt(start / 60 % 24, 10);
        var starttime = getTime(hours, minutes);
        $('#timestart').text(starttime);
    });
    $('#endtime').on('slidestop', function(evt) {
        end = $('#endtime').val();
        var minutes = parseInt(end % 60, 10);
        var hours = parseInt(end / 60 % 24, 10);
        var endtime = getTime(hours, minutes);
        $('#timeend').text(endtime);
    });

    function getTime(hours, minutes) {
        var time = null;
        minutes = minutes + "";
        if (hours < 12) {
            time = "AM";
        }
        else {
            time = "PM";
        }
        if (hours === 0) {
            hours = 12;
        }
        if (hours > 12) {
            hours = hours - 12;
        }
        hours = hours + "";
        if (hours.length == 1) {
            hours = "0" + hours;
        }
        if (minutes.length == 1) {
            minutes = "0" + minutes;
        }
        return hours + ":" + minutes + " " + time;
    }
});
