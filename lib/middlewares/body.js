'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _zanKoaBody = require('zan-koa-body');

var _zanKoaBody2 = _interopRequireDefault(_zanKoaBody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * strict {Boolean} If enabled, don't parse GET, HEAD, DELETE requests, default true
 */
module.exports = function () {
    return (0, _zanKoaBody2.default)({
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