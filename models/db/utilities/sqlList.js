var pgp = require('pg-promise');

// TODO: is this really needed?
module = function SqlList(template, data) {
    if (!(this instanceof SqlList)) {
        return new SqlList(template, data);
    }
    this._rawDBType = true;
    this.formatDBType = function () {
        return '(' + data.map(d => pgp.as.format(template, d)).join(',') + ')';
    };
};
