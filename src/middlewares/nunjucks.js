const fs = require('fs');
const path = require('path');
const defaultsDeep = require('lodash/defaultsDeep');
const env = require('./nunjucks/env');
const AutoEscapeExtension = require('./nunjucks/extensions/autoescape');

// 添加扩展
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));

module.exports = function(config) {

    const loadJs = function(key, vendor = false, crossorigin = false, ifAsync = false) {
        const keys = key.split('.');
        const realKey = vendor ? key : keys.length > 1 ? keys[1] : keys[0];
        const VERSION_MAP = config.VERSION_MAP;
        const realVersionJs = keys.length > 1 ? VERSION_MAP[keys[0]] : VERSION_MAP['version_js'];
        const src = (config.NODE_ENV === 'development' && !vendor) ?
            `/${realKey}.js` :
            (vendor ? `${config.CDN_PATH}/${realKey}` : `${config.CDN_PATH}/${realVersionJs[realKey]}`);
        let scriptStr = `<script onerror="_cdnFallback(this)" src="${src}" charset="utf-8"`;
        scriptStr += ifAsync ? ' async ' : '';
        scriptStr += crossorigin ? ' crossorigin="anonymous" ' : '';
        scriptStr += '></script>';

        return scriptStr;
    };
    const loadCss = function(key, vendor = false, media = 'screen') {
        const keys = key.split('.');
        const realKey = vendor ? key : keys.length > 1 ? keys[1] : keys[0];
        const VERSION_MAP = config.VERSION_MAP;
        const realVersionCss = (keys.length > 1 ? VERSION_MAP[keys[0]] : VERSION_MAP['version_css']) || {};
        const src = (config.NODE_ENV === 'development' && !vendor) ?
            `/${realKey}.css` :
            (vendor ? `${config.CDN_PATH}/${realKey}` : `${config.CDN_PATH}/${realVersionCss[realKey]}`);
        const linkStr = `<link rel="stylesheet" href="${src}" media="${media}">`;

        return linkStr;
    };
    const inlineJs = function(key) {
        let result = '<script>';
        const SERVER_ROOT = config.SERVER_ROOT;
        result += fs.readFileSync(path.resolve(SERVER_ROOT, `../${key}`), 'utf-8');
        result += '</script>';
        return result;
    };
    const inlineCss = function(key) {
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

    return async(ctx, next) => {
        const config = ctx.app.config;
        ctx.render = async function(name, context = {}) {
            if (ctx.beforeRenderFns) {
                for (let i = 0; i < ctx.beforeRenderFns.length; i++) {
                    await ctx.beforeRenderFns[i].call(ctx);
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
        };

        ctx.renderString = async function(name, context = {}) {
            const state = ctx.getState();
            const globalState = defaultsDeep({
                env: config.NODE_ENV,
                version: config.ZAN_VERSION
            }, context._global, ctx.getGlobal());
            const wrapContext = defaultsDeep({}, context, state);
            delete wrapContext.global;
            wrapContext._global = JSON.stringify(globalState);
            wrapContext.env = config.NODE_ENV;

            return env.render(name, wrapContext);
        };

        // 针对 iron 定制
        ctx.display = async function(name, context = {}) {
            if (ctx.beforeRenderFns) {
                for (let i = 0; i < ctx.beforeRenderFns.length; i++) {
                    await ctx.beforeRenderFns[i].call(ctx);
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
        };
        await next();
    };
};