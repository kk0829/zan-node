'use strict';

var _xss = require('xss');

var _xss2 = _interopRequireDefault(_xss);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function (options) {
    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            let query = ctx.query;
            let bodyData = ctx.request.body;
            let one = options.WHITELISTS.find(function (item) {
                return item.path === ctx.path;
            });
            let wrapOptions = one ? one.options : {};
            const whiteList = _xss2.default.getDefaultWhiteList();

            if (wrapOptions.enableStyle) {
                for (let key of Object.keys(whiteList)) {
                    whiteList[key].push('style');
                }
            }

            let customXss = new _xss2.default.FilterXSS({
                whiteList
            });

            if (query) {
                for (let key of Object.keys(query)) {
                    query[key] = customXss.process(query[key]);
                }
            }
            if (bodyData) {
                if ((0, _isObject2.default)(bodyData)) {
                    for (let key of Object.keys(bodyData)) {
                        if ((0, _isString2.default)(bodyData[key])) {
                            bodyData[key] = bodyData[key].trim();
                            bodyData[key] = customXss.process(bodyData[key]);
                        }
                    }
                }
            }
            yield next();
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })();
};