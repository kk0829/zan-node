'use strict';

const { Exception_404 } = require('./Error');

class BaseClass {
    constructor(ctx) {
        this.ctx = ctx;
        this.Exception_404 = Exception_404;
    }
}

module.exports = BaseClass;