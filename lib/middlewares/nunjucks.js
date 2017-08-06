'use strict';

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function (config) {
    let env = _nunjucks2.default.configure(config.VIEW_PATH, {
        autoescape: true
    });
    const loadJs = function (key, vendor = false, crossorigin = false, ifAsync = false) {
        const keys = key.split('.');
        const realKey = vendor ? key : keys.length > 1 ? keys[1] : keys[0];
        const VERSION_MAP = config.VERSION_MAP;
        const realVersionJs = keys.length > 1 ? VERSION_MAP[keys[0]] : VERSION_MAP['version_js'];
        const src = config.NODE_ENV === 'development' && !vendor ? `/${realKey}.js` : vendor ? `${config.CDN_PATH}/${realKey}` : `${config.CDN_PATH}/${realVersionJs[realKey]}`;
        let scriptStr = `<script src="${src}" charset="utf-8"`;
        scriptStr += ifAsync ? ' async ' : '';
        scriptStr += crossorigin ? ' crossorigin="anonymous" ' : '';
        scriptStr += '></script>';

        return scriptStr;
    };
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
    env.addGlobal('loadJs', loadJs);
    env.addGlobal('loadScript', loadJs);

    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            const config = ctx.app.config;
            ctx.render = function (name, context = {}) {
                const state = ctx.getState();
                const globalState = (0, _defaultsDeep2.default)({
                    env: config.NODE_ENV,
                    version: config.ZAN_VERSION
                }, context._global, ctx.getGlobal());
                const wrapContext = (0, _defaultsDeep2.default)({}, context, state);
                delete wrapContext.global;
                wrapContext._global = JSON.stringify(globalState);

                ctx.body = env.render(name, wrapContext);
            };
            yield next();
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })();
};