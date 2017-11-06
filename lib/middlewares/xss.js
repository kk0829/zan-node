'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
module.exports = function (options) {
    let WHITELISTS = options.WHITELISTS;
    for (let i = 0; i < WHITELISTS.length; i++) {
        WHITELISTS[i].pathReg = toRegexp(WHITELISTS[i].path);
    }
    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            let query = ctx.query;
            let bodyData = ctx.request.body;
            let one = options.WHITELISTS.find(function (item) {
                return item.pathReg.test(ctx.path);
            });
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
            yield next();
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })();
};