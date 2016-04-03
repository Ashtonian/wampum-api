var users = require('./db/dbProvider').db.users;
var bcrypt = require('bcrypt-as-promised');
var uuid = require('node-uuid');

const saltRounds = 10;

module.exports = {
    add: (user) => {
        user.userId = uuid.v4();
        return bcrypt.hash(user.password, saltRounds).then((hash, error) => {
            user.password = hash;
            return users.add(user);
        });
    },
    all: () => {
        return users.all();
    },
    find: id => {
        return users.find(id);
    },
    findByEmail: email => {
        return users.findByEmail(email);
    },
    remove: id => {
        return users.remove(id);
    },
    update: user => {
        // TODO: validate
        return users.update(user);
    },
    comparePassword: (plainTextPassword, hash) => {
        return bcrypt.compare(plainTextPassword, hash).then((result) => {
            return result;
        }).catch(bcrypt.MISMATCH_ERROR, (err) => {
            // TODO: handle errors
            console.log(err);
            return false;
        }).catch(err => {
            console.log(err);
            return false;
        });
    }
};
