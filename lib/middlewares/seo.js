'use strict';

var _zanUa = require('zan-ua');

var _zanUa2 = _interopRequireDefault(_zanUa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function (options) {
    let SEO_CONSTANTS = require(options.path);

    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            let isMobile = _zanUa2.default.isMobile(ctx.headers['user-agent']);
            let obj = Object.assign(SEO_CONSTANTS.default, isMobile ? SEO_CONSTANTS.wap_default || {} : SEO_CONSTANTS.www_default || {}, SEO_CONSTANTS[ctx.path] || {});
            ctx.setState({
                title: obj.title + obj.title_suffix,
                keywords: obj.keywords,
                description: obj.description
            });
            yield next();
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })();
};