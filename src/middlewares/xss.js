const xss = require('xss');
const isObject = require('lodash/isObject');
const isString = require('lodash/isString');
const toRegexp = require('path-to-regexp');

/**
 * WHITELISTS 数据格式
 [{
    path: '/api/application/basic',
    options: {
        enableStyle: true
    }
 }];
 */
module.exports = function(options) {
    let WHITELISTS = options.WHITELISTS;
    for (let i = 0; i < WHITELISTS.length; i++) {
        WHITELISTS[i].pathReg = toRegexp(WHITELISTS[i].path);
    }

    return async (ctx, next) => {
        let query = ctx.query;
        let bodyData = ctx.request.body;
        let one = options.WHITELISTS.find((item) => item.pathReg.test(ctx.path));
        // 黑科技
        if (one && one.options && one.options.close) {
            await next();
            return;
        }
        let wrapOptions = one ? one.options : {};
        const whiteList = xss.getDefaultWhiteList();

        if (wrapOptions.enableStyle) {
            for (let key of Object.keys(whiteList)) {
                whiteList[key].push('style');
            }
        }

        let customXss = new xss.FilterXSS({
            whiteList
        });

        if (query) {
            for (let key of Object.keys(query)) {
                query[key] = customXss.process(query[key]);
            }
        }
        if (bodyData) {
            if (isObject(bodyData)) {
                for (let key of Object.keys(bodyData)) {
                    if (isString(bodyData[key])) {
                        bodyData[key] = bodyData[key].trim();
                        bodyData[key] = customXss.process(bodyData[key]);
                    }
                }
            }
        }
        await next();
    };
};