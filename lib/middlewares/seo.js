'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const UA = require('zan-ua');
const toRegexp = require('path-to-regexp');

module.exports = function (options) {
    const SEO_CONSTANTS = require(options.path);
    let config = [];
    if (Array.isArray(SEO_CONSTANTS)) {
        for (let i = 0; i < SEO_CONSTANTS.length; i++) {
            config.push({
                key: SEO_CONSTANTS[i].key,
                value: SEO_CONSTANTS[i].value,
                reg: toRegexp(SEO_CONSTANTS[i].key)
            });
        }
    } else {
        for (let item in SEO_CONSTANTS) {
            config.push({
                key: item,
                reg: toRegexp(item),
                value: SEO_CONSTANTS[item]
            });
        }
    }
    let defaultItem = config.find(item => {
        return item.key === 'default';
    }) || {};
    let wapDefault = config.find(item => {
        return item.key === 'wap_default';
    }) || {};
    let wwwDefault = config.find(item => {
        return item.key === 'www_default';
    }) || {};

    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            const isMobile = UA.isMobile(ctx.headers['user-agent']);
            let resultObj = Object.assign({}, defaultItem.value, isMobile ? wapDefault.value : wwwDefault.value);
            let matchItem;
            for (let i = 0; i < config.length; i++) {
                if (config[i].reg.test(ctx.path)) {
                    matchItem = config[i].value;
                    break;
                }
            }
            resultObj = Object.assign(resultObj, matchItem || {});

            ctx.setState({
                title: resultObj.title + resultObj.title_suffix,
                keywords: resultObj.keywords,
                description: resultObj.description
            });
            yield next();
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })();
};