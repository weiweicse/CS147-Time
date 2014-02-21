/**
 * CS147-Time
 * --------------
 * By: Wei Wei, Kavin Yao, Grant Delgado
 */
var PORT = 3000;

// Express is a web framework for node.js
// that makes nontrivial applications easier to build
var express = require('express');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(express);

// connect to the Mongo database, whether locally or on Heroku
var local_database_name = 'record';
var local_database_uri = 'mongodb://localhost/' + local_database_name;
var database_uri = process.env.MONGOLAB_URI || local_database_uri;
mongoose.connect(database_uri);

// Import components
var core = require('./routes/core');
var api = require('./routes/api');

// Create the server instance
var app = express();

// Print logs to the console and compress pages we send
app.use(express.logger());
app.use(express.compress());
app.set('view engine', 'jade');
app.use(express.cookieParser('V1SUALT1M3'));
app.use(express.session({
    store: new MongoStore({
        url: database_uri
    })
}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// Return all pages in the /static directory
// whenever they are requested at '/'
// e.g., http://localhost:3000/index.html
// maps to /static/index.html on this machine
app.use(express.static(__dirname + '/static'));

// Add page routes
app.get('/', core.home);
app.get('/login', core.login);
app.get('/logout', core.logout);
app.get('/record', core.record);
app.get('/edit/:id', core.edit);
app.get('/usage', core.usage);
app.get('/history/prev', core.history_prev);
app.get('/history/:year/:month/:day', core.history_day);
app.get('/nav', core.nav);
app.get('/statistics', core.statistics);
app.get('/calendar', core.calendar);
app.get('/trend', core.trend);
app.post('/record/add', core.add_record);

// Add api routes
app.get('/api/user', api.get_user_info);
app.get('/api/stats', api.get_stats);
app.get('/api/usage/by/:duration', api.get_usage);
app.get('/api/trend', api.get_trend);
app.get('/api/calendar/:year/:month', api.get_calendar);
app.get('/api/history', api.get_history);
app.get('/api/history/prev', api.get_history_prev);
app.get('/api/history/next', api.get_history_next);
app.post('/api/record/add', api.add_record);

// Start the server
var port = process.env.PORT || PORT; // 80 for web, 3000 for development
app.listen(port, function() {
	console.log("Node.js server running on port %s", port);
});
