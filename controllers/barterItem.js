var defaultUserId = '2346b67a-9f02-40e6-984c-83ab20a993f5';
var barterItemRouter = require('express').Router();

var barterItems = require('../models/barterItem');

barterItemRouter.route('/')
    .get((request, response) => {

        if (request.query.currentUser) {
            barterItems.findByUserId(defaultUserId).then(results => {
                if (results) {
                    response.end(JSON.stringify(results));
                } else {
                    response.status('404').end();
                }
            });
        } else {
            barterItems.All().then(results => {
                response.end(JSON.stringify(results));
            });
        }

    })
    .post((request, response) => {

        barterItems.add(request.body,defaultUserId).then(results => {
            response.location(request.originalUrl + '/' + results.barterItemId).status('201').end(results.uploadInstructions);
        });

    })
    .put((request, response) => {
        response.end('item is suppossed to be updated if this was implemented.');
    });

barterItemRouter.route('/:id')
    .get((request, response) => {
        barterItems.find(request.params.id).then(results => {
            if (results) {
                response.end(JSON.stringify(results));
            } else {
                response.status('404').end();
            }
        });
    });

/*
barterItemRouter.route('/recommendations/').get(function (req, res) {
    // TODO: pass userId, long, lat
    barter_item.getRecommendations('', '', '').then(function (results) {
        res.end(JSON.stringify(results));
    });
});

barterItemRouter.route('/:_id/vote')
    .post(function (req, res) {
        barter_item.vote().then(function (results) {
            res.end('created a fucking vote');
        });
    });
*/
module.exports = barterItemRouter;
