const favicon = require('./favicon');
const zanStatic = require('./static');
const koaHelmet = require('koa-helmet');
const code = require('./code');
const seo = require('./seo');
const log = require('./log');
const body = require('./body');
const xss = require('./xss');
const mixin = require('./mixin');
const nunjucks = require('./nunjucks');
const health = require('./health');

module.exports = function(config) {
    return [{
        name: 'health',
        fn: health(),
        type: 'framework'
    }, {
        name: 'mixin',
        fn: mixin,
        type: 'framework'
    }, {
        name: 'favicon',
        fn: favicon(config.FAVICON_PATH),
        type: 'framework'
    }, {
        name: 'static',
        fn: zanStatic(config.STATIC_PATH),
        type: 'framework'
    }, {
        name: 'helmet',
        fn: koaHelmet({
            dnsPrefetchControl: false,
            noSniff: false,
            ieNoOpen: false,
            frameguard: false
        }),
        type: 'framework'
    }, {
        name: 'code',
        fn: code(config.CODE_PATH),
        type: 'framework'
    }, {
        name: 'seo',
        fn: seo({
            path: config.SEO_PATH
        }),
        type: 'framework'
    }, {
        name: 'nunjucks',
        fn: nunjucks(config),
        type: 'framework'
    }, {
        name: 'log',
        fn: log(),
        type: 'framework'
    }, {
        name: 'body',
        fn: body(),
        type: 'framework'
    }, {
        name: 'xss',
        fn: xss({
            WHITELISTS: config.XSS_WHITELISTS
        }),
        type: 'framework'
    }];
};