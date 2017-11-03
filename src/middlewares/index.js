import favicon from './favicon';
import zanStatic from './static';
import koaHelmet from 'koa-helmet';
import code from './code';
import seo from './seo';
import log from './log';
import body from './body';
import xss from './xss';
import mixin from './mixin';
import nunjucks from './nunjucks';

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
    }];
};
