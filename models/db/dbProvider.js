// initialize db driver options dependencies
var promise = require('bluebird');

promise.config({
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: true
});

var repos = {
    users: require('./repos/users.js'),
    barterItems: require('./repos/barterItems.js')
};


// set db driveroptsions
var options = {
    promiseLib: promise,
    extend: obj => {
        // Do not use 'require()' here, because this event occurs for every task
        // and transaction being executed, which should be as fast as possible.
        obj.users = repos.users(obj);
        obj.barterItems = repos.barterItems(obj);
    }

};

// intitialize db driver options
var pgp = require('pg-promise')(options);

// initialize connection pool
var connStr = process.env.DATABASE_URL;

var db = pgp(connStr);

// Load and attach the diagnostics:
var diag = require('./diagnostics');
diag.init(options);

module.exports = {
    pgp,
    db,
    close: () => {
        diag.done();
        pgp.end();
    }
};
