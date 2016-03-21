var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var morgan = require('morgan');

// TODO: response content-type elsewhere?
// TODO: response content-length elsewhere?
// TODO: create integration tests?
// TODO: create mocks?
// TODO: error handleing and 500 status code?
// TODO: version and base api route?
// TODO: add swagger to api
// TODO: user auth
// TODO: get all sql errors ever?
// TODO: catch all outgoing response errors?
// TODO: sequential UUID? quessable uuid? v1 vs v4?

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(morgan('dev'));

app.get('/', (request, response) => {
    response.send('shit is running.');
});

var port = process.env.PORT || 8080;

app.use('/user', require('./controllers/user'));
app.use('/barter-item', require('./controllers/barterItem'));

app.listen(port, () => {
    console.log('Example app listening on port ' + port + '!');
});
