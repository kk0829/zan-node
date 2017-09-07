'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (config) {

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
    const inlineJs = function (key) {
        let result = '<script>';
        const SERVER_ROOT = config.SERVER_ROOT;
        result += _fs2.default.readFileSync(_path2.default.resolve(SERVER_ROOT, `../${key}`), 'utf-8');
        result += '</script>';
        return result;
    };
    const inlineCss = function (key) {
        let result = '<style>';
        result += _fs2.default.readFileSync(_path2.default.resolve(config.SERVER_ROOT, `../${key}`), 'utf-8');
        result += '</style>';
        return result;
    };
    env.addGlobal('loadCss', loadCss);
    env.addGlobal('loadStyle', loadCss);
    env.addGlobal('loadJs', loadJs);
    env.addGlobal('loadScript', loadJs);
    env.addGlobal('inlineJs', inlineJs);
    env.addGlobal('inlineCss', inlineCss);

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

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

var _autoescape = require('./nunjucks_extensions/autoescape');

var _autoescape2 = _interopRequireDefault(_autoescape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const VIEW_PATH = _path2.default.join(process.cwd(), 'server/views');

let env = _nunjucks2.default.configure(VIEW_PATH, {
    autoescape: true
});

env.addExtension('AutoEscapeExtension', new _autoescape2.default(env));

exports.viewEnv = env;

;