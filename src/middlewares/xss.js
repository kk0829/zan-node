import xss from 'xss';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';

module.exports = function (options) {
    return async(ctx, next) => {
        let query = ctx.query;
        let bodyData = ctx.request.body;
        let one = options.WHITELISTS.find((item) => item.path === ctx.path);
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
