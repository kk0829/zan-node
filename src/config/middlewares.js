import favicon from '../middlewares/favicon';
import zanStatic from '../middlewares/static';
import koaHelmet from 'koa-helmet';
import code from '../middlewares/code';
import zanConfig from '../middlewares/config';
import seo from '../middlewares/seo';
import log from '../middlewares/log';
import body from '../middlewares/body';
import xss from '../middlewares/xss';
import mixin from '../middlewares/mixin';
import nunjucks from '../middlewares/nunjucks';
import router from '../middlewares/router3';

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
        name: 'nunjucks',
        fn: nunjucks(config)
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
    }, {
        name: 'router',
        fn: router(config)
    }];
};
