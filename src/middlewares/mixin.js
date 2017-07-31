import defaultsDeep from 'lodash/defaultsDeep';
import querystring from 'querystring';
import union from 'lodash/union';

module.exports = async(ctx, next) => {
    // 如果查询参数和请求体参数都有这个字段，则请求体中的参数优先级更高
    ctx.getRequestData = (key) => {
        const data = defaultsDeep(ctx.request.body, ctx.query);
        return key ? data[key] : data;
    };
    ctx.getPostData = (key) => {
        const data = ctx.request.body;
        return key ? data[key] : data;
    };
    ctx.getQueryData = (key) => {
        const str = ctx.querystring;
        let parsed = querystring.parse(str);
        Object.keys(parsed).forEach((item) => {
            if (Array.isArray(parsed[item]) && union(parsed[item]).length === 1) {
                parsed[item] = parsed[item][0];
            }
        });

        return key ? parsed[key] : parsed;
    };
    ctx.getRawCookies = () => {
        return ctx.headers.cookie;
    };
    ctx.getCookies = () => {
        let result = {};
        let cookies = ctx.headers.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            let arr = cookies[i].split('=');
            result[arr[0]] = arr[1];
        }
        return result;
    };
    ctx.getCookie = (name, options) => {
        return ctx.cookies.get(name, options);
    };
    ctx.setCookie = (name, value, options) => {
        ctx.cookies.set(name, value, options);
    };
    ctx.throwBusinessError = (type, code, msg) => {
        ctx.businessErrorType = type;
        ctx.businessErrorContent = {
            code,
            msg
        };
    };

    await next();
};
