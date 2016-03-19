var uuid = require('node-uuid');
'use strict';


function getFakeBarterItem() {
    var barterItemId = uuid.v4();
    var item = {
        barterItemId: uuid.v4(),
        userId: 'db8203a5-6bb8-40c9-bcd9-10b4cc92bf25', // TODO: fix
        title: 'integration item',
        description: 'integration test item',
        images: [{
            imageId: uuid.v4(),
            fileExtension: '.jpg'
        }, {
            imageId: uuid.v4(),
            fileExtension: '.png'
        }]
    };
    return item;
}

var barterItems = require('../../models/barterItems'); // go in through provider

describe('barter item model', () => {
    'use strict';

    /* add, all, find, findByUserId, Remove, update */
    let currentBarterItems = [];


    it('initializes correctly', done => {
        barterItems.should.not.be.null;
        done();
    });

    it('gets all barter items', done => {
        let barterItem = getFakeBarterItem();
        currentBarterItems.push(barterItem);
        barterItems.all().should.eventually.have.length.above(1).and.include(barterItem).notify(done);
    });

    afterEach(done => {

        // TODO: batch and call .close after all complete
        currentBarterItems.forEach((item) =>
            barterItems.remove(item.barterItemId)
        );

        require('../../db/dbProvider.js').close();
        done();
    });
});
