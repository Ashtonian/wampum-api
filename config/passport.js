var jwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var users = require('../models/users');
var secret = 'thisneedstobeamuchbettersecret'; // TODO: fix

module.exports = (passport) => {
    var options = {
        secretOrKey: secret,
        jwtFromRequest: ExtractJwt.fromAuthHeader()
    };
    passport.use(new jwtStrategy(options, (jwt_payload, done) => {
        // TODO: which id/ find method should be used ?
        users.find(jwt_payload.id).then((err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};
