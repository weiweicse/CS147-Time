$(function() {
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

    if (!is_mobile) {
        $start.datetimepicker();
        $end.datetimepicker();
    }

    /*
     * Note: set a.record-button(href='/?success') and preventDefault
     *       if error === true does not work in web app. So we set
     *       href=# and do manual redirect on success.
     */
    $('.update-button').click(function(e) {
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
            var json = {
                'id': $(this).data('id'),
                'task': $name.val(),
                'from': $start.val(),
                'to': $end.val()
            };

            if (!is_mobile) {
                json.from = $start.datetimepicker('getDate');
                json.to = $end.datetimepicker('getDate');
            }

            $.post('/api/record/update', json, function() {
                console.log("success");
                // return the the previous page
                window.location = $('.cancel-button').attr('href');
            });
        }
    });
});
