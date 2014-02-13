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
