var barterItemRouter = require('express').Router();

var barterItems = require('../models/barterItems');

barterItemRouter.route('/')
    .get((request, response) => {

        if (request.query.currentUser) {
            barterItems.findByUserId(request.user.userId).then(results => {
                if (results) {
                    response.send(results);
                } else {
                    response.status('404').end();
                }
            });
        } else {
            barterItems.all().then(results => {
                response.send(results);
            });
        }

    })
    .post((request, response) => {

        barterItems.add(request.body, request.user.userId).then(results => {
            response.location(request.originalUrl + '/' + results.barterItemId).status('201').send({
                uploadInstructions: results.uploadInstructions
            });
        });

    })
    .put((request, response) => {
        response.send('item is suppossed to be updated if this was implemented.');
    });

// Order dependent must be   routed before id, look into why and see about fixing it?
barterItemRouter.route('/recommendations/').get((request, response) => {
    barterItems.recommendations().then(results => {
        response.send(results);
    });
});

barterItemRouter.route('/:barterItemId').get((request, response) => {
    barterItems.find(request.params.barterItemId).then(results => {
        if (results) {
            response.send(results);
        } else {
            response.status('404').end();
        }
    });
});


/*
barterItemRouter.route('/:_id/vote')
    .post(function (req, res) {
        barter_item.vote().then(function (results) {
            res.end('created a fucking vote');
        });
    });
*/
module.exports = barterItemRouter;
