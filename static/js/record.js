$(function() {
    // for tracking purpose
    var t1 = new Date().getTime();
    // browser class detection
    var is_mobile = $('body').data('browser') === 'mobile';

    var $error_alert = $('#error-alert');
    var $name = $('#task-name-input');
    var $start = $('#start-time-input');
    var $end = $('#end-time-input');

    function clearError() {
        $error_alert.hide();
        $name.closest('.form-group').removeClass('has-error');
        $start.closest('.form-group').removeClass('has-error');
        $end.closest('.form-group').removeClass('has-error');
    }

    function showError(msg) {
        $error_alert.text(msg).fadeIn();
    }

    // reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
    function pad(number) {
      if (number < 10) {
          return '0' + number;
      }
      return number;
    }

    function dateToInputValue(date) {
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes());
    }

    // auto-fill start and end date
    var prefilled_date = $('body').data('date'), date;
    if (prefilled_date)
      date = new Date(prefilled_date + 'T10:00:00-08:00'); // use PST time
    else
      date = new Date();

    if (is_mobile) {
        $start.val(dateToInputValue(date));
        date.setHours(date.getHours() + 2);
        $end.val(dateToInputValue(date));
    } else {
        $start.datetimepicker();
        $end.datetimepicker();

        $start.datetimepicker('setDate', date);
        $end.datetimepicker('setDate', date);
    }

    /*
     * Note: set a.record-button(href='/?success') and preventDefault
     *       if error === true does not work in web app. So we set
     *       href=# and do manual redirect on success.
     */
    $('form').submit(function(e) {
        e.preventDefault();

        var error = false;

        clearError();
        if (!$name.val()) {
            error = true;
            $name.closest('.form-group').addClass('has-error');
            showError('Task name is empty.');
        } else if (!$start.val()) {
            error = true;
            $start.closest('.form-group').addClass('has-error');
            showError('Start time is empty.');
        } else if (!$end.val()) {
            error = true;
            $end.closest('.form-group').addClass('has-error');
            showError('End time is empty.');
        } else {
            var start = new Date($start.val());
            var end = new Date($end.val());

            if (start - end >= 0) {
                error = true;
                $start.closest('.form-group').addClass('has-error');
                $end.closest('.form-group').addClass('has-error');
                showError('Start time is later than end time. Please check again.');
            }
        }

        if (!error) {
            var t2 = new Date().getTime();
            var timespent = t2 - t1;
            ga('send', 'timing', 'record', 'record', timespent, 'record');
            ga('send', 'event', 'record', 'record', 'record', timespent);
            var json = {
                'task': $name.val(),
                'from': $start.val(),
                'to': $end.val()
            };

            if (!is_mobile) {
                json.from = $start.datetimepicker('getDate');
                json.to = $end.datetimepicker('getDate');
            }

            $.post('/record/add', json, function() {
                var start = new Date(json.from);
                if (prefilled_date)
                    window.location.href = '/history/' + start.getFullYear() + '/' + (start.getMonth() + 1) + '/' + start.getDate() + '/?success';
                else
                    window.location.href = '/?success';
            });
        }
    });
});
