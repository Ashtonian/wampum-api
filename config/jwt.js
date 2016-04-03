var jwt = require('express-jwt');
var secret = 'thisneedstobeamuchbettersecret'; // TODO: fix

module.exports = jwt({
    secret: secret
});
