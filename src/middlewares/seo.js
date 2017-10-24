import UA from 'zan-ua';
import toRegexp from 'path-to-regexp';

module.exports = function(options) {
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
    let defaultItem = config.find((item) => {
        return item.key === 'default';
    }) || {};
    let wapDefault = config.find((item) => {
        return item.key === 'wap_default';
    }) || {};
    let wwwDefault = config.find((item) => {
        return item.key === 'www_default';
    }) || {};

    return async(ctx, next) => {
        const isMobile = UA.isMobile(ctx.headers['user-agent']);
        let resultObj = Object.assign({},
            defaultItem.value,
            isMobile ? wapDefault.value : wwwDefault.value
        );
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
        await next();
    };
};