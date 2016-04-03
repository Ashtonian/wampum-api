var sql = require('../sql/sqlProvider.js').users;

module.exports = rep => {

    return {

        add: name => rep.one(sql.add, name)
            .then(results => {
                return results;
            }),

        all: () => rep.any(sql.all),

        find: id => rep.oneOrNone(sql.find, id),

        findByEmail: email => rep.oneOrNone(sql.findByEmail, email),

        remove: id => rep.result(sql.remove, id)
            .then(result => result.rowCount),

        update: user => rep.result(sql.update, user)
    };
};
