var uuid = require('node-uuid');

var defaultUserId = '2346b67a-9f02-40e6-984c-83ab20a993f5';
var barterItemRouter = require('express').Router();

var barterItemDb = require('../models/barter-item.js');

barterItemRouter.route('/')
    .get(function (req, res) {
        if (req.query.currentUser) {
            barterItemDb.getById(defaultUserId).then(function (result) {
                if (result) {
                    res.end(JSON.stringify(result));
                } else {
                    res.status('404').end();
                }
            });
        } else {
            barterItemDb.getAll().then(function (results) {
                res.end(JSON.stringify(results));
            });
        }
    })
    .post(function (req, res) {
        var barterItem = req.body;
        barterItem._user_id = defaultUserId;
        barterItem._id = uuid.v4();

        // Insert base item meta data
        pg.connect(connStr, function (err, client, done) {
            if (err)
                console.log('pg connect error: ' + err);
            client.query('INSERT INTO public.barter_item (_id,_user_id,title,description) VALUES($1::uuid,$2::uuid,$3,$4)', [barterItem._id, barterItem._user_id, barterItem.title, barterItem.description], function (err, result) {
                if (err) {
                    console.log('insert error: ' + err);
                    res.end('an error occured' + err);
                }
                done();

                // Generate instructions for all images
                var responseData = {};
                responseData.uploadInstructions = [];
                for (var i = 0; i < barterItem.images.length; i++) {

                    var fileUrl = barterItem.images[0];
                    var fileType = fileUrl.substr(fileUrl.lastIndexOf('.'));
                    var imageId = uuid.v4();
                    var fileName = imageId + fileType;
                    InsertImage({
                        _id: imageId,
                        _barter_item_id: barterItem._id,
                        file_extension: fileType
                    });

                    var signedUrl = getSignedUrl(fileName, fileType);
                    var return_data = {
                        uploadUrl: signedUrl,
                        accessURL: getS3Path(fileName),
                        fileName: fileName,
                        deviceFileUrl: fileUrl
                    };
                    responseData.uploadInstructions.push(return_data);
                }

                res.location(req.originalUrl + '/' + barterItem._id).status('201').send(responseData).end();
            });
        });
    })
    .put(function (req, res) {
        res.send('item is suppossed to be updated if this was implemented.');
    });

barterItemRouter.route('/recommendations/').get(function (req, res) {
    // TODO: pass userId, long, lat
    barter_item.getRecommendations('', '', '').then(function (results) {
        res.end(JSON.stringify(results));
    });
});

barterItemRouter.route('/:_id')
    .get(function (req, res) {
        barter_item.getById(req.params._id).then(function (results) {
            res.end(JSON.stringify(results));
        });
    });

barterItemRouter.route('/:_id/vote')
    .post(function (req, res) {
        barter_item.vote().then(function (results) {
            res.end('created a fucking vote');
        });
    });

module.exports = barterItemRouter;
