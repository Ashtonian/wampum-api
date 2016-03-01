var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var uuid = require('node-uuid');
var pg = require('pg').native;
var aws = require('aws-sdk');
var app = express();

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
  var host = req.get('host');
  console.log("host " + host);
  var origin = req.get('origin');
  console.log("origin " + origin);

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
var connStr = process.env.DATABASE_URL;
var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

function GetMimeTypeFromExtension(fileExtension) {
  if (fileExtension === '.png')
    return "image/png";
  if (fileExtension === '.jpeg' || fileExtension === '.jpg')
    return "image/jpeg";
}

function getSignedUrl(fileName, fileExtension) {
  // TODO: extract s3 code and use promises
  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_ACCESS_KEY
  });
  var s3 = new aws.S3();
  var s3_params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 10,
    ContentType: GetMimeTypeFromExtension(fileExtension),
    ACL: 'public-read'
  };
  return s3.getSignedUrl('putObject', s3_params);
}

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
      var itemId = uuid.v1();
      client.query('INSERT INTO public.User (_id,username,email,phonenumber) VALUES($1::uuid,$2,$3,$4)', [itemId, req.body.username, req.body.email, req.body.phonenumber], function(err, result) {
        if (err)
          res.end('an error occured' + err);
        done();
        res.location('/' + itemId);
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
        client.query('SELECT * FROM public.barter_item where _user_id = ($1)', [defaultUserId], function(err, result) {
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
        client.query('SELECT * FROM public.barter_item', function(err, result) {
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

    // TODO: make sure image types are ok
    // TODO: make sure that DeviceFileUrl is valid?

    var barterItem = req.body;
    barterItem._user_id = defaultUserId;
    barterItem._id = uuid.v4();

    // Insert base item meta data
    pg.connect(connStr, function(err, client, done) {
      if (err)
        console.log('pg connect error: ' + err);
      client.query('INSERT INTO public.barter_item (_id,_user_id,title,description) VALUES($1::uuid,$2::uuid,$3,$4)', [barterItem._id, barterItem._user_id, barterItem.title, barterItem.description], function(err, result) {
        if (err) {
          console.log('insert error: ' + err);
          res.end('an error occured' + err);
        }
        done();

        // Generate instructions for all images
        var responseData = {};
        responseData.uploadInstructions = [];
        for (var i = 0; i < barterItem.images.length; i++) {

          var fileUrl = barterItem.images[0];
          var fileType = fileUrl.substr(fileUrl.lastIndexOf('.'));
          var imageId = uuid.v4();
          var fileName = imageId + fileType;
          InsertImage({
            _id: imageId,
            _barter_item_id: barterItem._id,
            file_extension: fileType
          });

          var signedUrl = getSignedUrl(fileName, fileType);
          var return_data = {
            uploadUrl: signedUrl,
            accessURL: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + fileName,
            fileName: fileName,
            deviceFileUrl: fileUrl
          };
          responseData.uploadInstructions.push(return_data);
        }

        res.location(req.originalUrl + '/' + barterItem._id).status('201').send(responseData).end();
      });
    });
  })
  .put(function(req, res) {
    res.send('item is suppossed to be updated if this was implemented.');
  });


function InsertImage(image) {
  pg.connect(connStr, function(err, client, done) {
    if (err)
      console.log('pg connect error: ' + err);
    client.query('INSERT INTO public.barter_item_image (_id,_barter_item_id,file_extension) VALUES($1::uuid,$2::uuid,$3)', [image._id, image._barter_item_id, image.file_extension], function(err, result) {
      if (err) {
        console.log('insert error: ' + err);
      }
      done();
    });
  });
}

barterItemRouter.route('/recommendations/').get(function(req, res) {
  pg.connect(connStr, function(err, client, done) {
    client.query('SELECT * FROM public.barter_item', function(err, result) {
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
      client.query('SELECT * FROM public.barter_item WHERE _id = $1::uuid', [req.params._id], function(err, result) {
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



app.use('/user', userRouter);
app.use('/barter-item', barterItemRouter);

app.listen(port, function() {
  console.log('Example app listening on port ' + port + '!');
});
