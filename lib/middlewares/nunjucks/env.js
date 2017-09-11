'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let VIEW_PATH = process.env.NODE_ENV === 'development' ? _path2.default.join(process.cwd(), 'server/views') : _path2.default.join(process.cwd(), 'server_dist/views');

let env = _nunjucks2.default.configure(VIEW_PATH, {
    autoescape: true
});

exports.default = env;