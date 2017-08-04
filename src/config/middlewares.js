import favicon from '../middlewares/favicon';
import zanStatic from '../middlewares/static';
import koaHelmet from 'koa-helmet';
import code from '../middlewares/code';
import zanConfig from '../middlewares/config';
import seo from '../middlewares/seo';
import render from '../middlewares/render';
import log from '../middlewares/log';
import body from '../middlewares/body';
import xss from '../middlewares/xss';
import mixin from '../middlewares/mixin';
import loader from '../middlewares/loader';
import nunjucks from '../middlewares/nunjucks';

module.exports = function (config) {
    return [{
        name: 'mixin',
        fn: mixin
    }, {
        name: 'favicon',
        fn: favicon(config.FAVICON_PATH)
    }, {
        name: 'static',
        fn: zanStatic(config.STATIC_PATH)
    }, {
        name: 'helmet',
        fn: koaHelmet({
            dnsPrefetchControl: false,
            noSniff: false,
            ieNoOpen: false,
            frameguard: false
        })
    }, {
        name: 'code',
        fn: code(config.CODE_PATH)
    }, {
        name: 'config',
        fn: zanConfig({
            path: config.CONFIG_PATH,
            NODE_ENV: config.NODE_ENV
        })
    }, {
        name: 'seo',
        fn: seo({
            path: config.SEO_PATH
        })
    }, {
        name: 'loader',
        fn: loader({
            NODE_ENV: config.NODE_ENV,
            CDN_PATH: config.CDN_PATH
        })
    }, {
        name: 'render',
        fn: nunjucks(config)
    // }, {
    //     name: 'render',
    //     fn: render({
    //         viewPath: config.VIEW_PATH,
    //         extraConfig: config.VIEW_EXTRA_DATA
    //     })
    }, {
        name: 'log',
        fn: log()
    }, {
        name: 'body',
        fn: body()
    }, {
        name: 'xss',
        fn: xss({
            WHITELISTS: config.XSS_WHITELISTS
        })
    }];
};
