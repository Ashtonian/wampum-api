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

function setBarterItemIds(id, images) {
    images.map(image => image.barterItemId = id);
    return images;
}


module.exports = rep => {

    return {
        // Adds a new record and returns the new id;
        add: barterItem =>
            rep.tx(t => {
                return t.batch([
                    t.one(sql.add, barterItem),
                    t.many(sql.addImages, new Inserts('${barterItemImageId}::uuid,${barterItemId}::uuid,${fileExtension}', setBarterItemIds(barterItem.barterItemId, barterItem.images)))
                ]);
            })
            .then(data => {
                return {
                    barterItemId: data[0],
                    imageNames: data[1]
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
