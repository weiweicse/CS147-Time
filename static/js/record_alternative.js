$(function() {
    var start = 0;
    var end = 1439;
    var date = new Date();
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
    // type ahead
    // instantiate the bloodhound suggestion engine
    var numbers = new Bloodhound({
        datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.num); },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: [
            { num: 'one' },
            { num: 'two' },
            { num: 'three' },
            { num: 'four' },
            { num: 'five' },
            { num: 'six' },
            { num: 'seven' },
            { num: 'eight' },
            { num: 'nine' },
            { num: 'ten' }
        ]
    });

    // initialize the bloodhound suggestion engine
    numbers.initialize();

    // instantiate the typeahead UI
    $('#task-name-input').typeahead(null, {
        displayKey: 'num',
        source: numbers.ttAdapter()
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

    $('form').submit(function(e) {
        e.preventDefault();
        var starttime = $('#timepicker').val()[0];
        var endtime = $('#timepicker').val()[1];
        console.log(starttime);
        console.log(endtime);

        var date = picker.get('select', 'yyyy/mm/dd');
        console.log(date);

        var json = {
            'task': $('#task-name-input').val(),
            'from': date + ' ' + translateTime(starttime),
            'to': date + ' ' + translateTime(endtime)
        };

        $.post('/record/add', json, function() {
            console.log("success");
            window.location.href = '/?success';
        });
    });
});
