var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg').native;
var app = express();

var logger = function(req, res, next) {
  console.log("request: " + req.originalUrl);
  for (var propName in req.body) {
    var strLimit = 100;
    if (req.body.length < 100)
      strLimit = req.body.length;
    console.log("body." + propName + " = " + req.body[propName].toString().substr(0, strLimit));
  }
  for (var propName2 in req.params) {
    console.log("parameters." + propName2 + " = " + req.params[propName2]);
  }

  next(); // Passing the request to the next handler in the stack.

  console.log('response:');
  for (var propName3 in res.body) {
    var strLimit2 = 100;
    if (res.body.length < 100)
      strLimit2 = res.body.length;
    console.log("body." + propName3 + " = " + res.body[propName3].toString().substr(0, strLimit2));
  }
};

app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(logger);


app.get('/', function(req, res) {
  res.send('shit is running.');
});

var defaultUserId = 'db8203a5-6bb8-40c9-bcd9-10b4cc92bf25';
var port = process.env.PORT || 8080;
var connStr = process.env.DATABASE_URL || 'postgres://qguezoaqqkpscn:AUsy1xWO0Co4X_UBzf-fDckjGI@ec2-54-83-29-133.compute-1.amazonaws.com:5432/d5uc0fftpm2356';

// TODO: move routes to seperate place?
// TODO: create controllers?
// TODO: create data service for each resource?
// TODO: folder structure
// TODO: response status code goes elsewhere?
// TODO: response content-type elsewhere?
// TODO: response content-length elsewhere?
// TODO: async/promises/events for db response?
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

var userRouter = express.Router();
userRouter.route('/')
  .get(function(req, res) {
    pg.connect(connStr, function(err, client, done) {
      client.query('SELECT * FROM public.User', function(err, result) {
        if (err)
          res.end('an error occured' + err);
        done();
        var json = JSON.stringify(result.rows);

        res.writeHead(200, {
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(json)
        });
        res.end(json);
      });
    });
  })
  .post(function(req, res) {
    pg.connect(connStr, function(err, client, done) {
      client.query('INSERT INTO public.User (_id,username,email,phonenumber) VALUES($1::uuid,$2,$3,$4)', [req.body._id, req.body.username, req.body.email, req.body.phonenumber], function(err, result) {
        if (err)
          res.end('an error occured' + err);
        done();
        res.end('successful');
      });
    });

  }).put(function(req, res) {
    res.send('user is suppossed to be updated if this was implemented.');
  });

userRouter.route('/:_id')
  .get(function(req, res) {
    pg.connect(connStr, function(err, client, done) {
      client.query('SELECT * FROM public.User WHERE _id = $1::uuid', [req.params._id], function(err, result) {
        if (err)
          res.end('an error occured' + err);
        done();
        var json = JSON.stringify(result.rows);

        res.writeHead(200, {
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(json)
        });
        res.end(json);
      });
    });
  });

var barterItemRouter = express.Router();
barterItemRouter.route('/')

.get(function(req, res) {
    // TODO: optional parameters use samse query
    if (req.query.currentUser) {
      pg.connect(connStr, function(err, client, done) {
        client.query('SELECT * FROM public.barteritem where _userid = ($1)', [defaultUserId], function(err, result) {
          if (err)
            res.end('an error occured' + err);
          done();
          var json = JSON.stringify(result.rows);

          res.writeHead(200, {
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(json)
          });
          res.end(json);
        });
      });
    } else {
      pg.connect(connStr, function(err, client, done) {
        client.query('SELECT * FROM public.barteritem', function(err, result) {
          if (err)
            res.end('an error occured' + err);
          done();
          var json = JSON.stringify(result.rows);

          res.writeHead(200, {
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(json)
          });
          res.end(json);
        });
      });
    }
  })
  .post(function(req, res) {
    pg.connect(connStr, function(err, client, done) {
      if (err)
        console.log('pg connect error: ' + err);

      client.query('INSERT INTO public.barteritem (_id,_userid,title,description,image) VALUES($1::uuid,$2,$3,$4,$5)', [req.body._id, defaultUserId, req.body.title, req.body.description, req.body.image[0]], function(err, result) {
        if (err)
          console.log('insert error: ' + err);
        res.end('an error occured' + err);
        done();
        res.end('successful');
      });
    });
  })
  .put(function(req, res) {
    res.send('item is suppossed to be updated if this was implemented.');
  });

barterItemRouter.route('/recommendations/').get(function(req, res) {
  pg.connect(connStr, function(err, client, done) {
    client.query('SELECT * FROM public.barteritem', function(err, result) {
      if (err)
        res.end('an error occured' + err);
      done();
      var json = JSON.stringify(result.rows);

      res.writeHead(200, {
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(json)
      });
      res.end(json);
    });
  });
});

barterItemRouter.route('/:_id')
  .get(function(req, res) {
    pg.connect(connStr, function(err, client, done) {
      client.query('SELECT * FROM public.barteritem WHERE _id = $1::uuid', [req.params._id], function(err, result) {
        if (err)
          res.end('an error occured' + err);
        done();
        var json = JSON.stringify(result.rows[0]);

        res.writeHead(200, {
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(json)
        });
        res.end(json);
      });
    });
  });
barterItemRouter.route('/:_id/vote')
  .post(function(req, res) {
    res.send('created a fucking vote with: ' + req.body.like);
  });

var imageRouter = express.Router();
imageRouter.route('/').get(function(req, res) {
  pg.connect(connStr, function(err, client, done) {
    client.query('SELECT image FROM public.barteritem WHERE _id = $1::uuid', [req.params._id], function(err, result) {
      if (err)
        res.end('an error occured' + err);
      done();
      var img = new Buffer(result.rows[0], 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
      });

      res.end(img);
    });
  });
});

app.use('/user', userRouter);
app.use('/barter-item', barterItemRouter);
app.use('/image', imageRouter);


app.listen(port, function() {
  console.log('Example app listening on port ' + port + '!');
});
