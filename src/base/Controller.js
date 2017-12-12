const BaseClass = require('./BaseClass');

class Controller extends BaseClass {
    constructor(ctx) {
        super(ctx);
        this.ctx = ctx;
    }
};

module.exports = Controller;
