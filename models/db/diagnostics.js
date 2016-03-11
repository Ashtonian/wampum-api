var os = require('os');
var fs = require('fs');
var monitor = require('pg-monitor');

monitor.setTheme('matrix');

var $DEV = process.env.NODE_ENV === 'development';

var logFile = './models/db/errors.log';

monitor.log = (msg, info) => {

    if (info.event === 'error') {
        var logText = os.EOL + msg;
        if (info.time) {
            logText = os.EOL + logText;
        }
          console.log(logText);
        fs.appendFileSync(logFile, logText);
    }

    if (!$DEV) {
        info.display = true; // TODO
    }

};

var attached = false;

module.exports = {

    init: options => {
        if (attached || process.env.NODE_ENV === 'wallaby') {
            return;
        }

        attached = true;
        if ($DEV) {
            monitor.attach(options);
        } else {
            monitor.attach(options, ['error']);
        }
    },

    done: () => {
        if (attached) {
            attached = false;
            monitor.detach(); // detach from all the events;
        }
    }
};
