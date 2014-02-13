exports.home = function(req, res) {
    res.render('home', {
        user: {
            name: 'John'
        }
    });
};
