var barterItems = require('./db').barterItems;
var s3 = require('../utilities/s3.js');

function setImageGetUrls(barterItems) {
    barterItems.map(item => item.images.map(image => image.url = s3.getS3Path(image.name + image.extension)));
}

barterItems.add();
module.exports = {

};
