$(function() {
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

    // auto-fill start date
    var now = new Date();
    $start.val(dateToInputValue(now));

    // fill default value of end for better usability
    $end.on('focus', function() {
        if ($start.val() && !$end.val())
            $end.val($start.val());
    });

    /*
     * Note: set a.record-button(href='/?success') and preventDefault
     *       if error === true does not work in web app. So we set
     *       href=# and do manual redirect on success.
     */
    $('.record-button').click(function(e) {
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

        if (!error)
            window.location = '/?success';
    });
});
