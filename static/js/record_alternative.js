$(function() {
    var start = 0;
    var end = 1439;
    $('#datepicker').pickadate({
        // auto-fill date
        onStart: function() {
            console.log("hello, there");
            var date = new Date();
            this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()]);
        }
    });
    $('#timepicker').noUiSlider({
        range: [0, 1439],
        start: [0, 1439],
        step: 5,
        connect: true,
        slide: slide
    });

    function slide(evt, ui) {
        var starttime = $('#timepicker').val()[0];
        var endtime = $('#timepicker').val()[1];
        var minutes = parseInt(starttime % 60, 10);
        var hours = parseInt(starttime / 60 % 24, 10);
        $('#timestart').text(getTime(hours, minutes));
        minutes = parseInt(endtime % 60, 10);
        hours = parseInt(endtime / 60 % 24, 10);
        $('#timeend').text(getTime(hours, minutes));
    }

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
