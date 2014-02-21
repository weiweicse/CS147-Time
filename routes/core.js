var models = require('../models');

exports.login = function(req, res) {
    console.log(req.query.name);
    if (!req.query.name) {
        res.render('login');
        return;
    }
    req.session.username = req.query.name;
    res.redirect('/');
};

exports.logout = function(req, res) {
    req.session.username = '';
    res.redirect('/login');
};

exports.home = function(req, res) {
    if (!req.session.username)
        res.redirect('/login');

    var high = new Date();
    var low = new Date();
    low.setDate(high.getDate() - 5);
    low.setHours(0);
    low.setMinutes(0);
    low.setSeconds(0);
    models.Record
        .find({
            'user': req.session.username,
            'from': {$lt: high, $gte: low}
        })
        .exec(function(err, records) {
            var lists = populateRecords(records, low, high);
            res.render('home', {
                user: {
                    name: req.session.username
                },
                items: lists,
                from: req.query.from
            });
        });
};

function pad(i) {
    return i < 10 ? '0'+i : i;
}

function normalizeDate(date) {
    return [date.getFullYear(), date.getMonth()+1, date.getDate()].map(pad).join('-');
}

function normalizeTime(date) {
    var hour = date.getHours()+1;
    var ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;
    return [hour, date.getMinutes()+1].map(pad).join(':') + ampm;
}

function populateRecords(records, low, high) {
    var num_records = records.length;
    var dates = {};

    for (var d = low; d < high; d.setDate(d.getDate() + 1)) {
        dates[d] = [];
    }

    for (var i = 0; i < num_records; i++) {
        var record = records[i];
        // use date at 00:00:00 as key
        var from = new Date(record.from);
        from.setHours(0);
        from.setMinutes(0);
        from.setSeconds(0);

        dates[from].push({
            id: record._id,
            name: record.task,
            start: normalizeTime(record.from),
            end: normalizeTime(record.to)
        });
    }

    var lists = [];

    for (var date in dates) {
        lists.push({
            date: normalizeDate(new Date(date)),
            events: dates[date]
        });
    }

    lists.sort(function(a, b) {
        return new Date(a.date) < new Date(b.date);
    });

    return lists;
}

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
    var is_mobile = /mobile/i.test(req.header('user-agent'));
    res.render('record', {
        is_mobile: is_mobile,
        browser_class: is_mobile ? 'mobile' : 'desktop'
    });
};

exports.edit = function(req, res) {
    var id = req.params.id;
    models.Record
        .findOne({"_id": id})
        .exec(function(err, record) {
            var from = record.from;
            var to = record.to;
            res.render('edit', {
                back_url: req.get('Referer')
            });
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
        'user': req.session.username
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

exports.history_prev = function(req, res) {
    var last_date = req.query.date;
    console.log(last_date);
    var high = new Date(last_date);
    var low = new Date();
    low.setDate(high.getDate() - 5);
    low.setHours(0);
    low.setMinutes(0);
    low.setSeconds(0);
    models.Record
        .find({
            'user': req.session.username,
            'from': {$lt: high, $gte: low}
        })
        .exec(function(err, records) {
            var num_records = records.length;
            var dates = {};
            for (var d = low; d < high; d.setDate(d.getDate() + 1)) {
                dates[d] = [];
            }
            for (var i = 0; i < num_records; i++) {
                var record = records[i];
                var from = record.from;
                from.setHours(0);
                from.setMinutes(0);
                from.setSeconds(0);
                console.log("id " + record._id);
                dates[from].push({
                    id: record._id,
                    name: record.task,
                    start: record.from,
                    end: record.to
                });
            }
            lists = [];
            for (var date in dates) {
                lists.push({
                    date: date,
                    events: dates[date]
                });
            }
            lists.sort(function(a, b) {
                return new Date(a.date) < new Date(b.date);
            });
            console.log("print lists");
            console.log(lists);
            res.render('includes/history-items', {
                items: lists
            });
        });
};

exports.history_day = function(req, res) {
    var parts = [req.params.year, req.params.month, req.params.day];
    var last_date = parts.join('-');
    var high = new Date(last_date);
    var low = new Date();
    low.setDate(high.getDate());
    low.setHours(0);
    low.setMinutes(0);
    low.setSeconds(0);
    high.setDate(low.getDate() + 1);
    models.Record
    .find({
        'user': req.session.username,
        'from': {$lt: high, $gte: low}
    })
    .exec(function(err, records) {
        if (err) console.log(err);
        var num_records = records.length;
        var dates = {};
        for (var d = low; d < high; d.setDate(d.getDate() + 1)) {
            dates[d] = [];
        }
        console.log(dates);
        for (var i = 0; i < num_records; i++) {
            var record = records[i];
            var from = record.from;
            from.setHours(0);
            from.setMinutes(0);
            from.setSeconds(0);
            console.log("id:" + record._id);
            dates[from].push({
                id: record._id,
                name: record.task,
                start: record.from,
                end: record.to
            });
        }
        lists = [];
        console.log(lists);
        for (var date in dates) {
            lists.push({
                date: date,
                events: dates[date]
            });
        }
        res.render('history-day', {
            date: last_date,
            back_url: req.get('Referer'),
            items: lists
        });
    });
};
