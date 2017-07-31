import UA from './ua';

module.exports = function (options) {
    let SEO_CONSTANTS = require(options.path);

    return async(ctx, next) => {
        let isMobile = UA.isMobile(ctx.headers['user-agent']);
        let obj = Object.assign(
            SEO_CONSTANTS.default,
            isMobile ? SEO_CONSTANTS.wap_default || {} : SEO_CONSTANTS.www_default || {},
            SEO_CONSTANTS[ctx.path] || {}
        );
        ctx.setState({
            title: obj.title + obj.title_suffix,
            keywords: obj.keywords,
            description: obj.description
        });
        await next();
    };
};
