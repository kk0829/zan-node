'use strict';

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _koaRouter2.default();

let generateEntries = (srcPath, name, entries) => {
    name = name || '';
    entries = entries || [];

    let paths = _fs2.default.readdirSync(srcPath).filter(file => {
        return file.indexOf('.') !== 0 && file !== '_index.js' && file !== 'package.json';
    });

    for (let i = 0; i < paths.length; i++) {
        if (_fs2.default.statSync(_path2.default.join(srcPath, paths[i])).isDirectory()) {
            generateEntries(`${srcPath}/${paths[i]}`, `${name}/${paths[i]}`, entries);
        } else if (_fs2.default.statSync(_path2.default.join(srcPath, paths[i])).isFile() &&
        // filter js file
        paths[i].indexOf('.js') === paths[i].length - 3) {
            entries.push([`${name}`, _path2.default.join(srcPath, `${paths[i]}`)]);
        }
    }
    return entries;
};

module.exports = function (config) {
    let entries = generateEntries(config.path);

    for (let i = 0; i < entries.length; i++) {
        let r = require(entries[i][1]);
        router.use(entries[i][0], r.routes(), r.allowedMethods());
    }

    config.app.use(router.routes());
    config.app.use(router.allowedMethods());
};