'use strict';

var _remove = require('lodash/remove');

var _remove2 = _interopRequireDefault(_remove);

var _camelCase = require('lodash/camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.parseRequest = ctx => {
    const requestPath = ctx.path;
    const method = ctx.method;
    let requestDesc = {
        method: method,
        path: requestPath
    };
    if (/.json$/.test(requestPath)) {
        let pathArr = requestPath.slice(0, -5).split('/').slice(1);
        pathArr = (0, _remove2.default)(pathArr, item => {
            return item !== '';
        });
        if (pathArr.length === 1) {
            requestDesc.file = 'index.js';
            requestDesc.funcName = (0, _camelCase2.default)(`${method} ${pathArr[0]} json`);
        } else if (pathArr.length >= 2) {
            requestDesc.file = pathArr.slice(0, -1).join('/') + '.js';
            requestDesc.funcName = (0, _camelCase2.default)(`${method} ${pathArr.slice(-1)} json`);
        }
    } else if (/.html$/.test(requestPath)) {
        let pathArr = requestPath.replace('.html', '').split('/').slice(1);
        pathArr = (0, _remove2.default)(pathArr, item => {
            return item !== '';
        });
        if (pathArr.length === 1) {
            requestDesc.file = 'index.js';
            requestDesc.funcName = (0, _camelCase2.default)(`${method} ${pathArr[0]} html`);
        } else if (pathArr.length >= 2) {
            requestDesc.file = pathArr.slice(0, -1).join('/') + '.js';
            requestDesc.funcName = (0, _camelCase2.default)(`${method} ${pathArr.slice(-1)} html`);
        }
    } else {
        let pathArr = requestPath.split('/').slice(1);
        pathArr = (0, _remove2.default)(pathArr, item => {
            return item !== '';
        });
        if (requestPath === '/' && method === 'GET') {
            requestDesc.file = 'index.js';
            requestDesc.funcName = 'getIndexHtml';
        } else if (pathArr.length === 1) {
            requestDesc.file = 'index.js';
            requestDesc.funcName = (0, _camelCase2.default)(`${method} ${pathArr[0]} html`);
        } else if (pathArr.length === 2) {
            requestDesc.file = pathArr.join('/') + '.js';
            requestDesc.funcName = 'getIndexHtml';
        } else if (pathArr.length >= 2) {
            requestDesc.file = pathArr.slice(0, -1).join('/') + '.js';
            requestDesc.funcName = (0, _camelCase2.default)(`${method} ${pathArr.slice(-1)} html`);
        }
    }

    return requestDesc;
};