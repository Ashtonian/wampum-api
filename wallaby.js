module.exports = function (wallaby) {
    return {
        files: [{
                pattern: '.env',
                instrument: false
            },
            '**/*.log',
            '*.log',
            'controllers/**/*.js',
            'middlewares/**/*.js',
            'db/**/*.js',
            'models/**/*.js',
            'models/**/*.sql',
            'public/**/*.js',
            'utilities/**/*.js',
            'app.js'
        ],
        tests: [
            'tests/**/**.js'
        ],
        testFramework: 'mocha',
        env: {
            type: 'node'
        },
        setup: function () {
            require('dotenv').config();
            //  process.env.NODE_ENV = 'wallaby';
            var chai = require('chai');
            var chaiAsPromised = require('chai-as-promised');
            chai.use(chaiAsPromised);
            var should = chai.should();
        },

        teardown: function () {}
    };
};
