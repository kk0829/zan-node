'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
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

exports.default = ParamsError;