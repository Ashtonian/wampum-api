var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var winston = require('winston');
var expressWinston = require('express-winston');
var unless = require('express-unless');


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
// TODO: express-jwt returns too much information when token is not provided


app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        })
    ],
    meta: true,
    //  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
    colorStatus: true // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
}));

app.use(require('./config/jwt').unless({
    path: ['/user/authenticate', {
        url: '/user',
        methods: ['POST']
    }, '/']
}));

app.get('/', (request, response) => {
    response.send('shit is running.');
});

var port = process.env.PORT || 8080;

app.use('/user', require('./controllers/user'));
app.use('/barter-item', require('./controllers/barterItem'));


app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        })
    ]
}));


app.listen(port, () => {
    console.log('Example app listening on port ' + port + '!');
});
