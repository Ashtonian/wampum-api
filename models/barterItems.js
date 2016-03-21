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

// TODO: consolodate with s3
function GetMimeTypeFromExtension(fileExtension) {
    if (fileExtension === '.png') return "image/png";
    if (fileExtension === '.jpeg' || fileExtension === '.jpg') return "image/jpeg";
}

// TODO: move to s3?
function getImageUploadInstructions(image) {
    return {
        imageId: image.imageId,
        uploadUrl: s3.getSignedPutUrl(image.imageId, image.fileExtension),
        accessUrl: s3.getS3Path(image.imageId + image.fileExtension),
        devicePath: image.devicePath,
        // TODO: figure out if key/name are needed in options?
        options: {
            fileKey: image.imageId + image.fileExtension,
            fileName: image.imageId + image.fileExtension,
            httpMethod: 'PUT',
            headers: {
                'Content-Type': GetMimeTypeFromExtension(image.fileExtension),
                'x-amz-acl': 'public-read'
            },
            chunkedMode: true,
            encodeURI: false
        }
    };
}

module.exports = {
    add: (barterItem, userId) => {
        // TODO: validate barter item before it hits the repo

        // set ids
        barterItem.barterItemId = uuid.v4();
        barterItem.images.forEach(image => {
            image.imageId = uuid.v4();
        });

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
        return barterItems.recommendations().then(getBarterItemsWithImageUrls);
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
