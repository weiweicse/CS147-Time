var models = require('../models');

exports.get_user_info = function(req, res) {
    res.json({
        name: 'John'
    });
};

exports.get_stats = function(req, res) {
    var json = {};

    var promise = models.Record
        .find()
        .exec();

    promise.addBack(function(err, records) {
        var starttime = new Date().valueOf();
        var cnt = records.length;
        var sum = 0;
        for (var i = 0; i < records.length; i++) {
            var record = records[i];
            starttime = Math.min(record.from, starttime);
            sum += (record.to - record.from) / 1000 / 60 / 60;
            console.log(sum);
        }
        res.json({
            "days": Math.round((new Date().valueOf() - starttime) / 1000 / 60 / 60 / 24),
            "tasks": cnt,
            "hours": sum
        });
    });
};

exports.get_usage = function(req, res) {
    console.log("get usage request for " + req.params.duration);
    var tasks = [
        {
            name: 'Clean House',
            minutes: Math.random()*100,
            color: '#F38630'
        },
        {
            name: 'CS147',
            minutes: Math.random()*400,
            color: '#E0E4CC'
        },
        {
            name: 'Feed Cat',
            minutes: Math.random()*200,
            color: '#69D2E7'
        }
    ];

    res.json(tasks);
};

exports.get_trend = function(req, res) {
    var starttime = new Date();
    starttime.setHours(0);
    starttime.setMinutes(0);
    starttime.setSeconds(0);
    starttime.setDate(starttime.getDate() - 29);
    console.log(starttime);
    models.Record
        .find({
            from: {$gte: starttime}
        })
        .exec(afterFinding);

    function afterFinding(err, records) {
        if (err) {
            console.log(err);
            res.send(500);
        }
        var cnt = {};
        var now = new Date();
        // initialization
        for (var d = starttime; d <= now; d.setDate(d.getDate() + 1)) {
            cnt[d] = 0;
        }
        // statistics
        for (var i = 0; i < records.length; i++) {
            var from = records[i].from;
            from.setHours(0);
            from.setMinutes(0);
            from.setSeconds(0);
            cnt[from]++;
        }
        // convert map to array
        var arr = [];
        for (var key in cnt) {
            arr.push(cnt[key]);
        }
        res.json(arr);
    }
};

exports.get_calendar = function(req, res) {
    var values = [], i;
    for (i = 0;i < 35;++i)
        values.push(Math.floor(Math.random() * 5));

    res.json(values);
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

exports.add_record = function(req, res) {
    // just return success
    // TODO: interact with mongodb
    res.json({});
};
