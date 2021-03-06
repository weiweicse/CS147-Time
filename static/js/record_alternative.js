$(function() {
    // for tracking purpose
    var t1 = new Date().getTime();
    var start = 0;
    var end = 1439;
    var prefilled_date = $('body').data('date'), date;
    if (prefilled_date)
        date = new Date(prefilled_date + 'T10:00:00-08:00');
    else
        date = new Date();
    // date picker
    var $input = $('#datepicker').pickadate({
        // auto-fill date
        onStart: function() {
            this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()]);
        }
    });
    var picker = $input.pickadate('picker');
    // time picker
    $('#timepicker').noUiSlider({
        range: [0, 1439],
        start: [Math.max(0, date.getHours() - 1) * 60 + date.getMinutes(), date.getHours() * 60+ date.getMinutes()],
        step: 5,
        connect: true,
        slide: slide
    });

    // slide call back function
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

    slide();

    function translateTime(mins) {
        var minutes = parseInt(mins % 60, 10);
        var hours = parseInt(mins / 60 % 24, 10);
        return getTime(hours, minutes);
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

    var $error_alert = $('#error-alert');
    var $name = $('#task-name-input');

    function clearError() {
        $error_alert.hide();
        $name.closest('.form-group').removeClass('has-error');
    }

    function showError(msg) {
        $error_alert.text(msg).fadeIn();
    }

    $('form').submit(function(e) {
        e.preventDefault();

        clearError();

        var task_name = $name.val();
        if (!task_name) {
            $name.closest('.form-group').addClass('has-error');
            showError('Task name is empty.');
            return;
        }

        var t2 = new Date().getTime();
        var timespent = t2 - t1;
        ga('send', 'timing', 'record', 'record_alternative', timespent, 'record_alternative');
        ga('send', 'event', 'record', 'record_alternative', 'record_alternative', timespent);
        var starttime = $('#timepicker').val()[0];
        var endtime = $('#timepicker').val()[1];

        var date = picker.get('select', 'yyyy/mm/dd');

        var json = {
            'task': task_name,
            'from': date + ' ' + translateTime(starttime),
            'to': date + ' ' + translateTime(endtime)
        };

        $.post('/record/add', json, function() {
            var start = new Date(json.from);
            if (prefilled_date)
                window.location.href = '/history/' + start.getFullYear() + '/' + (start.getMonth() + 1) + '/' + start.getDate() + '/?success';
            else
                window.location.href = '/?success';
        });
    });
});
