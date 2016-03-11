var uuid = require('node-uuid');

function getFakeBarterItem() {
    var barterItemId = uuid.v4();
    var item =  {
        barterItemId: uuid.v4(),
        userId: 'db8203a5-6bb8-40c9-bcd9-10b4cc92bf25', // TODO: fix
        title: 'integration item',
        description: 'integration test item',
        images: [{
            barterItemImageId: uuid.v4(),
            fileExtension: '.jpg'
        }, {
            barterItemImageId: uuid.v4(),
            fileExtension: '.png'
        }]
    };
    return item;
}

var barterItems = require('../../../../models/db/dbProvider.js').db.barterItems; // go in through provider

describe('barter item repo', function () {

    /* add, all, find, findByUserId, Remove, update */
    currentBarterItems = [];

    it('initializes correctly', function (done) {
        barterItems.should.not.be.null;
        done();
    });

    it('adds item and gets item correctly', function (done) {
        var barterItem = getFakeBarterItem();
        barterItems.add(barterItem).should.eventually.have.length.above(1000).notify(done);
    });

    it('gets all barter items', function (done) {
        barterItems.all().should.eventually.have.length.above(1).and.include({
            _id: '2346b67a-9f02-40e6-984c-83ab20a993f5',
            _user_id: 'db8203a5-6bb8-40c9-bcd9-10b4cc92bf25',
            title: 'This one has like 6 images',
            description: 'This one also has like 6 images',
            images: [{
                _id: '66c1db38-13b3-48b7-a48c-8deeffe7d518',
                _barter_item_id: '2346b67a-9f02-40e6-984c-83ab20a993f5',
                file_extension: '.jpg'
            }, {
                _id: 'dc3b7901-5c04-4fda-a7e2-2e8e5db76374',
                _barter_item_id: '2346b67a-9f02-40e6-984c-83ab20a993f5',
                file_extension: '.jpg'
            }, {
                _id: '2fd6f9a9-a532-4509-81ef-add8764ff3c0',
                _barter_item_id: '2346b67a-9f02-40e6-984c-83ab20a993f5',
                file_extension: '.jpg'
            }, {
                _id: '732f04a6-9342-4a69-9db1-312fd094cca8',
                _barter_item_id: '2346b67a-9f02-40e6-984c-83ab20a993f5',
                file_extension: '.jpg'
            }, {
                _id: '97e82bbf-5743-4043-8298-57e70124051f',
                _barter_item_id: '2346b67a-9f02-40e6-984c-83ab20a993f5',
                file_extension: '.jpg'
            }, {
                _id: '47595154-949d-4170-811f-360cb33ac4c2',
                _barter_item_id: '2346b67a-9f02-40e6-984c-83ab20a993f5',
                file_extension: '.jpg'
            }]
        }).notify(done);
    });

    it('finds a specific barter item by id', function (done) {
        barterItems.find('2346b67a-9f02-40e6-984c-83ab20a993f5').should.eventually.be.eql({
            _id: '2346b67a-9f02-40e6-984c-83ab20a993f5',
            _user_id: 'db8203a5-6bb8-40c9-bcd9-10b4cc92bf25',
            title: 'This one has like 6 images',
            description: 'This one also has like 6 images',
            images: [{
                _id: '66c1db38-13b3-48b7-a48c-8deeffe7d518',
                _barter_item_id: '2346b67a-9f02-40e6-984c-83ab20a993f5',
                file_extension: '.jpg'
            }, {
                _id: 'dc3b7901-5c04-4fda-a7e2-2e8e5db76374',
                _barter_item_id: '2346b67a-9f02-40e6-984c-83ab20a993f5',
                file_extension: '.jpg'
            }, {
                _id: '2fd6f9a9-a532-4509-81ef-add8764ff3c0',
                _barter_item_id: '2346b67a-9f02-40e6-984c-83ab20a993f5',
                file_extension: '.jpg'
            }, {
                _id: '732f04a6-9342-4a69-9db1-312fd094cca8',
                _barter_item_id: '2346b67a-9f02-40e6-984c-83ab20a993f5',
                file_extension: '.jpg'
            }, {
                _id: '97e82bbf-5743-4043-8298-57e70124051f',
                _barter_item_id: '2346b67a-9f02-40e6-984c-83ab20a993f5',
                file_extension: '.jpg'
            }, {
                _id: '47595154-949d-4170-811f-360cb33ac4c2',
                _barter_item_id: '2346b67a-9f02-40e6-984c-83ab20a993f5',
                file_extension: '.jpg'
            }]
        }).notify(done);
    });

    afterEach(function (done) {
        require('../../../../models/db/dbProvider.js').close();
        done();
    });
});
