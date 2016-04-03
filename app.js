var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var passport = require('passport');
require('./config/passport')(passport);

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
// TODO: handle errors better accorss stack
// TODO: user email already exists
// TODO: handle unexpected token parsing json incoming errors
// TODO: expire jwt token after x time, the client should then renew the jwt-token,
// upon renewal it should then check the "session-store" to see if a re-auth is required. If it is, then clear/renew both.
// the session-store will keep track of the device, last auth, last request?? (scalibilty).
// Add nonce (jti), experation date, creation time to JWT.
// TODO: look into storing session data in token, primarily role, userid, authorized items to modify.
// TODO: look into jwt algorithms
// TODO: helmet
// TODO: rate limit
// TODO: app yeoman template w/docker + clustering
// TODO: use config variable for jwt secret
// TODO: make jwt secret better

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(morgan('dev'));

app.use(passport.initialize());

app.get('/', (request, response) => {
    response.send('shit is running.');
});

var port = process.env.PORT || 8080;

app.use('/user', require('./controllers/user'));
app.use('/barter-item', passport.authenticate('jwt', { session: false}), require('./controllers/barterItem'));

app.listen(port, () => {
    console.log('Example app listening on port ' + port + '!');
});
