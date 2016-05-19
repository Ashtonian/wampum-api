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
            // TODO: requires authorization
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
    });

// Order dependent must be routed before id, look into why and see about fixing it?
barterItemRouter.route('/recommendations/').get((request, response) => {
    barterItems.recommendations().then(results => {
        response.send(results);
    });
});

barterItemRouter.route('/:barterItemId').get((request, response) => {
    // TODO: requires authorization
    barterItems.find(request.params.barterItemId).then(results => {
        if (results) {
            response.send(results);
        } else {
            response.status('404').end();
        }
    });
});

// TODO: add pagination to GetAll();
// TODO: BarterItem Update
// TODO: BarterItem AddPhoto
// TODO: BarterItem DeletePhoto
// TODO: BarterItem Deactivate
// TODO: Vote(item_id_to,item_id_from,vote)
// TODO: parameter requirements

module.exports = barterItemRouter;
