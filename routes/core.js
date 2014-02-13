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

exports.history = function(req, res) {
    res.render('history');
};
