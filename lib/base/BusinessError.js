"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
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

exports.default = BusinessError;