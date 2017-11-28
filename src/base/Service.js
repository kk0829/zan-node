const BaseClass = require('./BaseClass');

class Service extends BaseClass {
    constructor(...args) {
        super(...args);
        this.ctx = args[0];
    }
};

module.exports = Service;
