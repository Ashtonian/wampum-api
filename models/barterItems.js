var barterItems = require('./db/dbProvider').db.barterItems;
var s3 = require('../utilities/s3.js');
var uuid = require('node-uuid');

function getBarterItemWithImageUrls(barterItem) {
    barterItem.images.map(image => image.url = s3.getS3Path(image.imageId + image.fileExtension));
    return barterItem;
}

function getBarterItemsWithImageUrls(barterItems) {
    barterItems.map(item => getBarterItemWithImageUrls(item));
    return barterItems;
}

function getImageUploadInstructions(image) {
    return {
        imageId: image.imageId,
        uploadUrl: s3.getSignedPutUrl(image.imageId, image.fileExtension),
        accessUrl: s3.getS3Path(image.imageId + image.fileExtension),
        devicePath: image.devicePath
    };
}

module.exports = {
    add: (barterItem, userId) => {
        // TODO: validate barter item before it hits the repo

        // set ids
        barterItem.barterItemId = uuid.v4();
        barterItem.images.map(image => image.imageId = uuid.v4());

        return barterItems.add(barterItem, userId).then(insertResults => {
            // TODO: validate all items were inserted correctly - barterItems.images.select(imageId).should.be.in.insertResults.imageIds
            return {
                barterItemId: barterItem.barterItemId,
                uploadInstructions: barterItem.images.map(image => getImageUploadInstructions(image))
            };
        });
    },
    all: () => {
        return barterItems.all().then(getBarterItemsWithImageUrls);
    },
    recommendations: () => {
        // TODO: replace with recommendations query ?
        return barterItems.all().then(getBarterItemsWithImageUrls);
    },
    find: id => {
        return barterItems.find(id).then(getBarterItemWithImageUrls);
    },
    findByUserId: userId => {
        return barterItems.findByUserId(userId).then(getBarterItemsWithImageUrls);
    },
    remove: id => {
        return barterItems.remove(id);
    },
    update: barterItem => {
        // TODO: validate
        return barterItems.update(barterItem);
    }
};
