var models = require('../models');

exports.home = function(req, res) {
    var dates = ['2014-02-13', '2014-02-12', '2014-02-11', '2014-02-10'];
    res.render('home', {
        user: {
            name: 'John'
        },
        items: randomEvents(dates),
        from: req.query.from
    });
};

exports.nav = function(req, res) {
    res.render('nav');
};

exports.statistics = function(req, res) {
    res.render('statistics');
};

exports.calendar = function(req, res) {
  res.render('calendar');
};

exports.record = function(req, res) {
    res.render('record');
};

exports.edit = function(req, res) {
    res.render('edit', {
        back_url: req.get('Referer')
    });
};

exports.add_record = function(req, res) {
    var form_data = req.body;
    console.log("form data");
    console.log(form_data);
    var record = new models.Record({
        'task': form_data.task,
        'from': form_data.from,
        'to': form_data.to,
        'user': form_data.user
    });
    record.save(afterSaving);

    function afterSaving(err) {
        if (err) {
            console.log(err);
            res.send(500);
        }
        res.redirect('/');
    }
};

exports.usage = function(req, res) {
    res.render('usage');
};

exports.trend = function(req, res) {
    res.render('trend');
};

var tasks = ['Feed Cat', 'CS147', 'Exercise', 'Running', 'Studio', 'Movie'];

function randomEvents(dates) {
    return dates.map(function(d) {
        var events = [], num_events = Math.floor(Math.random()*3+2);
        while (num_events--) events.push({
            name: tasks[Math.floor(Math.random()*tasks.length)],
            start: '09:10AM',
            end: '11:30AM'
        });

        return {
            date: d,
            events: events
        };
    });
}

function toInt(s) {
    return parseInt(s, 10);
}

function toStr(i) {
    return i < 10 ? '0'+i : i;
}

function previousDates(d, n) {
    var parts = d.split('-').map(toInt);
    var dates = [];
    while (n--) {
        parts[2] -= 1;

        if (parts[2] === 0) {
            parts[2] = 31;
            parts[1] -= 1;

            if (parts[1] === 0) {
                parts[1] = 12;
                parts[0] -= 1;
            }
        }

        dates.push(parts.map(toStr).join('-'));
    }

    return dates;
}

exports.history_prev = function(req, res) {
    var last_date = req.query.date;
    res.render('includes/history-items', {
        items: randomEvents(previousDates(last_date, 5))
    });
};

exports.history_day = function(req, res) {
    var parts = [req.params.year, req.params.month, req.params.day];
    var last_date = parts.join('-');
    res.render('history-day', {
        date: last_date,
        back_url: req.get('Referer'),
        items: randomEvents([last_date])
    });
};
