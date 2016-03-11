var dbProvider = require('../../../models/db/dbProvider.js');

describe('Db Provider', function () {

    it('initializes correctly', function (done) {
        dbProvider.should.not.be.null;
        dbProvider.pgp.should.not.be.null;
        dbProvider.db.should.not.be.null;
        done();
    });

    afterEach(function (done) {
        require('../../../models/db/dbProvider.js').close();
        done();
    });

});
