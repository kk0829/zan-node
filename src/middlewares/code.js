module.exports = function (codeFileConfig) {
    const CODE = require(`${codeFileConfig}`);
    return async (ctx, next) => {
        ctx.CODE = CODE;
        await next();
    };
};
