'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');
const defaultsDeep = require('lodash/defaultsDeep');
const env = require('./nunjucks/env');
const AutoEscapeExtension = require('./nunjucks/extensions/autoescape');
const mapKeysToSnakeCase = require('zan-utils/string/mapKeysToSnakeCase');

// 添加扩展
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));

module.exports = function (config) {

    const loadJs = function (key, vendor = false, crossorigin = false, ifAsync = false) {
        const keys = key.split('.');
        const realKey = vendor ? key : keys.length > 1 ? keys[1] : keys[0];
        const VERSION_MAP = config.VERSION_MAP;
        const realVersionJs = keys.length > 1 ? VERSION_MAP[keys[0]] : VERSION_MAP['version_js'];
        const src = config.NODE_ENV === 'development' && !vendor ? `/${realKey}.js` : vendor ? `${config.CDN_PATH}/${realKey}` : `${config.CDN_PATH}/${realVersionJs[realKey]}`;
        let scriptStr = `<script onerror="_cdnFallback(this)" src="${src}" charset="utf-8"`;
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
        result += fs.readFileSync(path.resolve(SERVER_ROOT, `../${key}`), 'utf-8');
        result += '</script>';
        return result;
    };
    const inlineCss = function (key) {
        let result = '<style>';
        result += fs.readFileSync(path.resolve(config.SERVER_ROOT, `../${key}`), 'utf-8');
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
            ctx.render = (() => {
                var _ref2 = _asyncToGenerator(function* (name, context = {}) {
                    if (ctx.beforeRenderFns) {
                        for (let i = 0; i < ctx.beforeRenderFns.length; i++) {
                            yield ctx.beforeRenderFns[i].call(ctx);
                        }
                    }

                    const state = ctx.getState();
                    const globalState = defaultsDeep({
                        env: config.NODE_ENV,
                        version: config.ZAN_VERSION
                    }, context._global, ctx.getGlobal());
                    const wrapContext = defaultsDeep({}, context, state);
                    delete wrapContext.global;
                    wrapContext._global = JSON.stringify(globalState);
                    wrapContext.env = config.NODE_ENV;

                    ctx.body = env.render(name, wrapContext);
                });

                return function (_x3) {
                    return _ref2.apply(this, arguments);
                };
            })();

            /**
             * 返回 HTML 字符串
             * @param  {String} name      模板路径
             * @param  {Object} context   传递给模板的数据
             * @param  {Boolean} camelCase  是否开启数据格式转换
             */
            ctx.renderString = (() => {
                var _ref3 = _asyncToGenerator(function* (name, context = {}, snakeCase = false) {
                    const state = ctx.getState();
                    const globalState = defaultsDeep({
                        env: config.NODE_ENV,
                        version: config.ZAN_VERSION
                    }, context._global, ctx.getGlobal());
                    const wrapContext = defaultsDeep({}, context, state);
                    delete wrapContext.global;
                    wrapContext._global = JSON.stringify(globalState);
                    wrapContext.env = config.NODE_ENV;

                    if (snakeCase) {
                        return env.render(name, mapKeysToSnakeCase(wrapContext));
                    } else {
                        return env.render(name, wrapContext);
                    }
                });

                return function (_x4) {
                    return _ref3.apply(this, arguments);
                };
            })();

            // 针对 iron 定制
            ctx.display = (() => {
                var _ref4 = _asyncToGenerator(function* (name, context = {}) {
                    if (ctx.beforeRenderFns) {
                        for (let i = 0; i < ctx.beforeRenderFns.length; i++) {
                            yield ctx.beforeRenderFns[i].call(ctx);
                        }
                    }

                    const state = ctx.getState();
                    const globalState = defaultsDeep({
                        env: config.NODE_ENV,
                        version: config.ZAN_VERSION
                    }, context._global, ctx.getGlobal());
                    const wrapContext = defaultsDeep({}, context, state);
                    delete wrapContext.global;
                    wrapContext._global = JSON.stringify(globalState);
                    wrapContext.env = config.NODE_ENV;
                    let arr = name.split('/');
                    arr.splice(1, 0, 'views');
                    name = arr.join('/');

                    ctx.body = env.render(name, wrapContext);
                });

                return function (_x5) {
                    return _ref4.apply(this, arguments);
                };
            })();
            yield next();
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })();
};