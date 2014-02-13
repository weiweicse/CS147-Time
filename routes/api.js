exports.test = function(req, res) {
    res.render('test', {
        name: 'John'
    });
};

exports.get_user_info = function(req, res) {
    res.json({
        name: 'John'
    });
};

exports.get_stats = function(req, res) {
    res.json({
        days: 123,
        tasks: 256,
        hours: 1973
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
    res.json([5, 4, 6, 8, 1, 7, 2]);
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
