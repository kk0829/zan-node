'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koaBody = require('koa-body');

var _koaBody2 = _interopRequireDefault(_koaBody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * strict {Boolean} If enabled, don't parse GET, HEAD, DELETE requests, default true
 */
module.exports = function () {
    return (0, _koaBody2.default)({
        formidable: {
            uploadDir: _path2.default.join('/tmp')
        },
        multipart: true,
        jsonLimit: '3mb',
        formLimit: '3mb',
        textLimit: '3mb',
        strict: false
    });
};