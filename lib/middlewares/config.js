'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * @param {String} config.path 配置文件目录
 * @param {String} config.NODE_ENV 环境变量
 */
module.exports = function (config) {
    config = config || {};
    config.NODE_ENV = config.NODE_ENV || 'development';
    const commonConfig = require(`${config.path}/common.js`);
    const envConfig = require(`${config.path}/config.${config.NODE_ENV}.js`);
    const obj = _lodash2.default.defaultsDeep({}, envConfig, commonConfig);
    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            ctx.getConfig = function (name) {
                let arr = name.split('.');
                let result = obj;
                let i = 0;
                while (arr[i]) {
                    result = result[arr[i]];
                    i++;
                }
                return result;
            };
            yield next();
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })();
};