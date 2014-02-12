$(function() {
    $.stayInWebApp();
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

    $('.record-button').click(function(e) {
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

        if (error)
            e.preventDefault();
    });
});
