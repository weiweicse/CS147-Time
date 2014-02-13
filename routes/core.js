exports.home = function(req, res) {
    res.render('home', {
        user: {
            name: 'John'
        }
    });
};

exports.record = function(req, res) {
    res.render('record');
};

exports.usage = function(req, res) {
    res.render('usage');
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

exports.history = function(req, res) {
    var dates = ['2014-02-13', '2014-02-12', '2014-02-11', '2014-02-10'];
    res.render('history', {
        items: randomEvents(dates)
    });
};
