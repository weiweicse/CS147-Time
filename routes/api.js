var models = require('../models');

exports.get_user_info = function(req, res) {
    res.json({
        name: req.session.username
    });
};

exports.get_stats = function(req, res) {
    var json = {};

    var promise = models.Record
        .find({user: req.session.username})
        .exec();

    promise.addBack(function(err, records) {
        var starttime = new Date().valueOf();
        var cnt = records.length;
        var sum = 0;
        for (var i = 0; i < records.length; i++) {
            var record = records[i];
            starttime = Math.min(record.from, starttime);
            sum += (record.to - record.from) / 1000 / 60 / 60;
        }
        res.json({
            "days": Math.round((new Date().valueOf() - starttime) / 1000 / 60 / 60 / 24),
            "tasks": cnt,
            "hours": Math.round(sum)
        });
    });
};

exports.get_tasks = function(req, res) {
    var username = req.session.username;
    var duration = 14; // two weeks
    var high = new Date();
    var low = new Date(high);
    low.setDate(high.getDate() - duration);
    models.Record
        .find({
            user: req.session.username,
            from: {$lt: high, $gte: low}
        })
        .exec(function(err, records) {
            if (err) {
                console.log(err);
                res.send(500);
                return;
            }

            res.json(records);
        });
};

// Ref: http://stackoverflow.com/a/12266311/1240620
function getRandomColor() {
    var r = (Math.round(Math.random()* 127) + 127).toString(16);
    var g = (Math.round(Math.random()* 127) + 127).toString(16);
    var b = (Math.round(Math.random()* 127) + 127).toString(16);
    return '#' + r + g + b;
}

exports.get_usage = function(req, res) {
    var duration = req.params.duration;
    var high = new Date();
    var low = new Date(high);
    low.setDate(high.getDate() - duration);
    /*
        {
            name: 'Clean House',
            minutes: Math.random()*100,
            color: '#F38630'
        }
   */
    models.Record
        .find({
            'user': req.session.username,
            'from': {$lt: high, $gte: low}
        })
        .exec(function(err, records) {
            if (err) {
                console.log(err);
                res.send(500);
                return;
            }
            var num_records = records.length;
            var names = {};
            for (var i = 0; i < num_records; i++) {
                if (records[i].task in names) {
                    names[records[i].task].minutes += (records[i].to - records[i].from) / 1000 / 60;
                } else {
                    names[records[i].task] = {};
                    names[records[i].task].name = records[i].task;
                    names[records[i].task].minutes = (records[i].to - records[i].from) / 1000 / 60;
                    names[records[i].task].color = getRandomColor();
                }
            }
            var arr = [];
            for (var n in names) {
                arr.push(names[n]);
            }
            arr.sort(function(a, b) {
                return a.minutes < b.minutes;
            });
            res.json(arr);
        });
};

exports.get_trend = function(req, res) {
    var starttime = new Date();
    starttime.setHours(0);
    starttime.setMinutes(0);
    starttime.setSeconds(0);
    starttime.setDate(starttime.getDate() - 29);
    models.Record
        .find({
            user: req.session.username,
            from: {$gte: starttime}
        })
        .exec(afterFinding);

    function afterFinding(err, records) {
        if (err) {
            console.log(err);
            res.send(500);
            return;
        }
        var timeusage = {};
        var now = new Date();
        // initialization
        for (var d = starttime; d <= now; d.setDate(d.getDate() + 1)) {
            timeusage[d] = 0;
        }
        // statistics
        for (var i = 0; i < records.length; i++) {
            var from = new Date(records[i].from);
            from.setHours(0);
            from.setMinutes(0);
            from.setSeconds(0);
            timeusage[from] += (records[i].to - records[i].from) / 3600000;
        }
        // convert map to array
        var arr = [];
        for (var key in timeusage) {
            arr.push(Math.round(timeusage[key]));
        }
        res.json(arr);
    }
};

exports.get_calendar = function(req, res) {
    var i;
    var year = req.params.year;
    var month = req.params.month;
    var daysArray = [];
    var firstDayOfTheWeek = new Date(year, month, 1).getDay();
    var daysInPreviousMonth = new Date(year, month, 0).getDate();
    var cnt = 0;
    for (i = 1; i <= firstDayOfTheWeek; i++) {
        daysArray.push(new Date(year, month - 1, daysInPreviousMonth - firstDayOfTheWeek + i));
        cnt++;
    }
    var daysInMonth = new Date(year, month, 0).getDate();
    for (i = 1; i <= daysInMonth; i++) {
        daysArray.push(new Date(year, month, i));
        cnt++;
    }
    var daysRequiredFromNextMonth = 35 - cnt;
    for (i = 1; i <= daysRequiredFromNextMonth; i++) {
        daysArray.push(new Date(year, month + 1, i));
    }
    daysArray = daysArray.slice(0, 35);
    var low = daysArray[0];
    var high = daysArray[34];
    var intensity = {};
    for (i = 0; i < daysArray.length; i++) {
        intensity[daysArray[i]] = 0;
    }
    models.Record
        .find({user: req.session.username, from: {$lte: high, $gte: low}})
        .exec(function(err, records) {
            if (err) {
                console.log(err);
                res.send(500);
                return;
            }
            var num_records = records.length;
            var date;
            for (i = 0; i < num_records; i++) {
                date = new Date(records[i].from);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                intensity[date] += (records[i].to - records[i].from) / 3600000;
            }
            var ret = [];
            for (i = 0; i < daysArray.length; i++) {
                ret.push(intensity[daysArray[i]]);
            }
            res.json(ret);
        });

};

exports.get_history = function(req, res) {
    res.json({
    });
};

exports.get_history_prev = function(req, res) {
    res.json({
    });
};

exports.get_history_next = function(req, res) {
    res.json({
    });
};

exports.get_today = function(req, res) {
    var now = new Date();
    var low = new Date();
    low.setHours(0);
    low.setMinutes(0);
    low.setSeconds(0);
    var high = new Date();
    high.setHours(22);
    high.setMinutes(0);
    high.setSeconds(0);
    models.Record
        .find({
            user: req.session.username,
            from: {$lt: high, $gte: low}
        })
        .exec(function(err, records) {
            if (err) {
                console.log(err);
                res.send(500);
                return;
            }
            // manually add a slot of now
            var now = new Date();
            var next_min = new Date(now);
            next_min.setMinutes(next_min.getMinutes()+5);
            records.push({
                task: 'NOW',
                from: now,
                to: next_min
            });

            // sort the records
            records.sort(function(a, b) {
                return new Date(a.from) > new Date(b.from);
            });
            // get intervals
            num_records = records.length;
            var begin = new Date();
            begin.setHours(8);
            begin.setMinutes(0);
            begin.setSeconds(0);
            var total = high - begin;
            var intervals = [];
            for (var i = 0; i < num_records && begin < high; i++) {
                if (records[i].from > begin) {
                    intervals.push({
                        name: null,
                        percentage: (records[i].from - begin) / total
                    });
                    intervals.push({
                        name: records[i].task,
                        percentage: (Math.min(records[i].to, high) - records[i].from) / total
                    });
                    begin = records[i].to;
                } else if (records[i].to > begin) {
                    intervals.push({
                        name: records[i].task,
                        percentage: (records[i].to - begin) / total
                    });
                    begin = records[i].to;
                }
            }
            if (begin < high) {
                intervals.push({
                    name: null,
                    percentage: (high - begin) / total
                });
            }
            res.json(intervals);
        });
};

exports.add_record = function(req, res) {
    // just return success
    // TODO: interact with mongodb
    res.json({});
};
