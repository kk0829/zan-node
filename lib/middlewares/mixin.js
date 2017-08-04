'use strict';

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _union = require('lodash/union');

var _union2 = _interopRequireDefault(_union);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = (() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
        // 如果查询参数和请求体参数都有这个字段，则请求体中的参数优先级更高
        ctx.getRequestData = function (key) {
            const data = (0, _defaultsDeep2.default)(ctx.request.body, ctx.query);
            return key ? data[key] : data;
        };
        ctx.getPostData = function (key) {
            const data = ctx.request.body;
            return key ? data[key] : data;
        };
        ctx.getQueryData = function (key) {
            const str = ctx.querystring;
            let parsed = _querystring2.default.parse(str);
            Object.keys(parsed).forEach(function (item) {
                if (Array.isArray(parsed[item]) && (0, _union2.default)(parsed[item]).length === 1) {
                    parsed[item] = parsed[item][0];
                }
            });

            return key ? parsed[key] : parsed;
        };
        ctx.getRawCookies = function () {
            return ctx.headers.cookie;
        };
        ctx.getCookies = function () {
            let result = {};
            let cookies = ctx.headers.cookie.split('; ');
            for (let i = 0; i < cookies.length; i++) {
                let arr = cookies[i].split('=');
                result[arr[0]] = arr[1];
            }
            return result;
        };
        ctx.getCookie = function (name, options) {
            return ctx.cookies.get(name, options);
        };
        ctx.setCookie = function (name, value, options) {
            ctx.cookies.set(name, value, options);
        };
        ctx.throwBusinessError = function (type, code, msg) {
            ctx.businessErrorType = type;
            ctx.businessErrorContent = {
                code,
                msg
            };
        };
        ctx.json = function (status, data) {
            ctx.body = {
                code: status.code,
                msg: status.msg,
                data
            };
            return;
        };

        yield next();
    });

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();