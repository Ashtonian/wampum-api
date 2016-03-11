var express = require('express');
var userRouter = express.Router();
var userDb = require('../models/user.js');

userRouter.route('/')
  .get(function(req, res) {
    userDb.getAll().then(function(result) {
      res.end(JSON.stringify(result));
    });
  })
  .post(function(req, res) {
    var user = {};
    userDb.create(user).then(function(results) {
      res.location(req.originalUrl + '/' + results._id).status('201').end();
    });
  }).put(function(req, res) {
    res.send('TODO'); // TODO
  });
  userRouter.route('/:_id')
  .get(function(req, res) {
    userDb.getById(req.params._id).then(function(result) {
      if (result) {
        res.end(JSON.stringify(result));
      } else {
        res.status('404').end();
      }
    });
  });


module.exports = userRouter;
