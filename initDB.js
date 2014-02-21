/*
 * This script will initialize a local Mongo database on your machine
 * so you can do development work.
 *
 * IMPORTANT: You should make sure the
 *
 *      Local_database_name
 *
 * variable matches its value in app.js. Otherwise, you will have
 * initialized the wrong database.
 */

var mongoose = require('mongoose');
var models = require('./models');

var local_database_name = 'record';
var local_database_uri = 'mongodb://localhost/' + local_database_name;
var database_uri = process.env.MONGOLAB_URI || local_database_uri;
mongoose.connect(database_uri);

// Do the initialization here

// Step 1: load the JSON data
var records_json = require('./records.json');

console.log(records_json);

// Step 2: remove all existing documents
models.Record
    .find()
    .remove()
    .exec(onceClear);

function onceClear(err) {
    if (err) console.log(err);

    var to_save_count = records_json.length;
    for (var i = 0; i < records_json.length; i++) {
        var json = records_json[i];
        var record = new models.Record(json);
        console.log(record);
        record.save(afterSaving);
    }

    function afterSaving(err, record) {
        if (err) console.log(err);
        to_save_count--;
        console.log(to_save_count + ' left to save');
        if (to_save_count <= 0) {
            console.log('DONE');
            mongoose.connection.close();
        }
    }
}
