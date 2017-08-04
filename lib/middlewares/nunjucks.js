'use strict';

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function (config) {
    let env = _nunjucks2.default.configure(config.VIEW_PATH, {
        autoescape: true
    });
    const loadCss = function (key, vendor = false, media = 'screen') {
        const keys = key.split('.');
        const realKey = vendor ? key : keys.length > 1 ? keys[1] : keys[0];
        const VERSION_MAP = config.VERSION_MAP;
        const realVersionCss = (keys.length > 1 ? VERSION_MAP[keys[0]] : VERSION_MAP['version_css']) || {};
        const src = config.NODE_ENV === 'development' && !vendor ? `/${realKey}.css` : vendor ? `${config.CDN_PATH}/${realKey}` : `${config.CDN_PATH}/${realVersionCss[realKey]}`;
        const linkStr = `<link rel="stylesheet" href="${src}" media="${media}">`;

        return linkStr;
    };
    env.addGlobal('loadCss', loadCss);
    env.addGlobal('loadStyle', loadCss);

    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            ctx.render = function (name, context = {}) {
                ctx.body = env.render(name, context);
            };
            yield next();
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })();
};