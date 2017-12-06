'use strict';

class ParamsError extends Error {
    constructor(code, msg) {
        super();
        this.errorContent = {
            type: 'paramsError',
            code,
            msg
        };
    }
}

class BusinessError extends Error {
    constructor(type, code, msg) {
        super(type);
        this.errorContent = {
            type,
            code,
            msg
        };
    }
}

class Exception_404 extends Error {
    constructor(...args) {
        super(...args);
    }
}

module.exports = {
    ParamsError,
    BusinessError,
    Exception_404
};