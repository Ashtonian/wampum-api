// TODO: try to MOVE this somewhere else!!
var pgp = require('pg-promise');

function Inserts(template, data) {
    if (!(this instanceof Inserts)) {
        return new Inserts(template, data);
    }
    this._rawDBType = true;
    this.formatDBType = function () {
        return data.map(d => '(' + pgp.as.format(template, d) + ')').join(',');
    };
}



var sql = require('../sql/sqlProvider.js').barterItems;

/**
deep copy images in array so that when the barterItemId is added it does not modify the original objects.
TODO: find a better way to do this?
*/
function getImagesToInsert(id, images) {
    return images.map(
        image => {
            return {
                imageId: image.imageId,
                barterItemId: id,
                fileExtension: image.fileExtension
            };
        });
}

module.exports = rep => {

    return {
        // Adds a new record and returns the new id;
        add: barterItem =>
            rep.tx(t => {
                return t.batch([
                    t.one(sql.add, barterItem),
                    t.many(sql.addImages, new Inserts('${imageId}::uuid,${barterItemId}::uuid,${fileExtension}', getImagesToInsert(barterItem.barterItemId, barterItem.images)))
                ]);
            })
            .then(data => {
                return {
                    barterItemId: data[0].barterItemId,
                    imageIds: data[1].map(img => img.imageId)
                };
            }),

        all: () => rep.any(sql.all),

        find: id => rep.oneOrNone(sql.find, id),

        findByUserId: userId => rep.any(sql.find, userId),

        remove: id => rep.result(sql.remove, id)
            .then(result => result.rowCount),

        update: barterItem => rep.result(sql.update, barterItem)
    };
};