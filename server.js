var express = require('express');
var app = express();
var pg = require('pg');

var port = process.env.PORT || 8080;

app.get('/', function (req, res) {

  pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      res.send(JSON.stringify(row));
    });
});

});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});
