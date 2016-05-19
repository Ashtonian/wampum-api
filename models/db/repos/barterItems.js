var sql = require('../sql/sqlProvider.js').barterItems;
var Inserts = require('../utilities/inserts');
var SqlList = require('../utilities/sqlList');


/**
deep copy images in array so that when the barterItemId is added it does not modify the original objects.
TODO: it's a bit annoying because its copying data and feels a bad data model?
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


// TODO: optional parameters in sql to re-use same sql for different find methods?
module.exports = rep => {
    return {
        // Adds a new record and returns the new id;
        add: (barterItem, userId) =>
            rep.tx(t => {
                return t.batch([
                    t.one(sql.add, {
                        barterItemId: barterItem.barterItemId,
                        userId: userId,
                        title: barterItem.title,
                        description: barterItem.description
                    }),
                    t.many(sql.addImages, new Inserts('${imageId}::uuid,${barterItemId}::uuid,${fileExtension}', getImagesToInsert(barterItem.barterItemId, barterItem.images)))
                ]);
            })
            .then(data => {
                return {
                    barterItemId: data[0].barterItemId,
                    imageIds: data[1].map(img => img.imageId)
                };
            }),

        addImages: (barterItemId, images) => rep.many(sql.addImages, new Inserts('${imageId}::uuid,${barterItemId}::uuid,${fileExtension}', getImagesToInsert(barterItemId, images)))
            .then(data => {
                return {
                    imageIds: data[1].map(img => img.imageId)
                };
            }),

        vote: votes => rep.vote(sql.vote, new Inserts('${barter_item_to}::uuid,${barter_item_from}::uuid,${vote}'), votes),

        all: () => rep.any(sql.all),

        find: id => rep.oneOrNone(sql.find, id),

        findByLocation: location => rep.any(sql.findByLocation, location),

        findByUserId: userId => rep.any(sql.findByUserId, userId),

        recommendations: () => rep.any(sql.recommendations),

        remove: id => rep.result(sql.remove, id)
            .then(result => result.rowCount),

        removeImages: imageIds => rep.one(sql.removeImages, new SqlList('${1}:uuid', imageIds)),

        update: barterItem => rep.result(sql.update, barterItem)
    };
};
