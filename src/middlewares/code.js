import fs from 'fs';

module.exports = function(codeFileConfig) {
    const CODE = fs.existsSync(`${codeFileConfig}`) ? require(`${codeFileConfig}`) : {};
    return async(ctx, next) => {
        ctx.CODE = CODE;
        await next();
    };
};