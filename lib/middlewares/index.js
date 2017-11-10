'use strict';

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