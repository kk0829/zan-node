'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let BASE_PATH = process.env.NODE_ENV === 'development' ? _path2.default.join(process.cwd(), 'server') : _path2.default.join(process.cwd(), 'server_dist');

let VIEW_PATH = [];
if (_fs2.default.existsSync(_path2.default.join(BASE_PATH, 'views'))) {
    VIEW_PATH.push(_path2.default.join(BASE_PATH, 'views'));
}
if (_fs2.default.existsSync(_path2.default.join(BASE_PATH, 'src'))) {
    VIEW_PATH.push(_path2.default.join(BASE_PATH, 'src'));
}

let env = _nunjucks2.default.configure(VIEW_PATH, {
    autoescape: true
});

exports.default = env;