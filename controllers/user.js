var express = require('express');
var userRouter = express.Router();
var users = require('../models/users');
var jwt = require('jwt-simple');
var secret = 'thisneedstobeamuchbettersecret'; // TODO: fix

// TODO: censor password on getters where needed, probably in the model?

userRouter.route('/')
    .get((request, response) => {
        users.all().then((users) => {
            response.send(users);
        });
    })
    .post((request, response) => {
        users.add(request.body).then((results) => {
            response.location(request.originalUrl + '/' + results.userId).status('201').end();
        });
    }).put((request, response) => {
        response.send('TODO'); // TODO
    });
userRouter.route('/:userId')
    .get((request, response) => {
        users.find(request.params.userId).then((user) => {
            if (user) {
                response.send(user);
            } else {
                response.status('404').end();
            }
        });
    });

userRouter.post('/authenticate', (request, response) => {
    users.findByEmail(request.body.email).then(user => {
        if (!user) {
            // TODO: status code?
            response.send({
                success: false,
                msg: 'Authentication failed. User not found.'
            });
        } else {
            users.comparePassword(request.body.password, user.password).then((isMatch, other) => {
                if (isMatch) {
                    var payload = {
                        userId: user.userId,
                        role: user.role
                    };
                    var token = jwt.encode(payload, secret);
                    response.send({
                        success: true,
                        token: 'Bearer ' + token
                    });
                } else {
                    response.send({
                        success: false,
                        msg: 'Authentication failed. Wrong password.'
                    });

                }
            });
        }
    });
});


module.exports = userRouter;
