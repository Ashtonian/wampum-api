var barterItems = require('../db/dbProvider').db.barterItems;
var s3 = require('../utilities/s3.js');
var uuid = require('node-uuid');

function setImageGetUrls(barterItem) {
    barterItem.images.map(image => image.url = s3.getS3Path(image.name + image.extension));
    return barterItem;
}

function setImageGetUrlsForMany(barterItems) {
    barterItems.map(item => setImageGetUrls(item));
    return barterItems;
}

module.exports = {
    add: barterItem => {
        return barterItems.add(barterItem);
    },
    all: () => {
        return barterItems.all().then(setImageGetUrlsForMany);
    },
    find: id => {
        return barterItems.find(id).then(setImageGetUrls);
    },
    findByUserId: userId => {
        return barterItems.findByUserId(userId).then(setImageGetUrlsForMany);
    },
    remove: id => {
        return barterItems.remove(id);
    },
    update: barterItem => {
        return barterItems.update(barterItem);
    }
};



/*

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
*/
