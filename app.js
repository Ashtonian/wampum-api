var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var uuid = require('node-uuid');
var pg = require('pg').native;
var app = express();

var morgan = require('morgan');


// TODO: move routes to seperate place?
// TODO: create controllers?
// TODO: create data service for each resource?
// TODO: folder structure
// TODO: response status code goes elsewhere?
// TODO: response content-type elsewhere?
// TODO: response content-length elsewhere?
// TODO: async/promises/events for db response?
// TODO: CREATE SERVICES BEFORE YOU LOOSE YOUR MIND
// TODO: create integration tests?
// TODO: create mocks?
// TODO: named postgres query parameters?
// TODO: create postgres sql sprocs/prepared sql query?
// TODO: error handleing and 500 status code?
// TODO: version and base api route?
// TODO: if _id path is not found should return 404?
// TODO: using UUID for PK and postgresSql?
// TODO: fix route nesting?
// TODO: bytea image
// TODO: multiple images pert barter-item/move images to image table
// TODO: add swagger to api
// TODO: user auth
// TODO: get all sql errors ever?
// TODO: catch all outgoing response errors?
// TODO: sequential UUID? quessable uuid? v1 vs v4?

app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(morgan('dev'));


app.get('/', function(req, res) {
  res.send('shit is running.');
});

var defaultUserId = 'db8203a5-6bb8-40c9-bcd9-10b4cc92bf25';
var port = process.env.PORT || 8080;
var connStr = process.env.DATABASE_URL;


app.use('/user', require('./controllers/user.js'));
app.use('/barter-item', require('./controllers/barter-item.js'));

app.listen(port, function() {
  console.log('Example app listening on port ' + port + '!');
});
