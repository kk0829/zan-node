module.exports = async(ctx, next) => {
    ctx.json = (status, data) => {
        ctx.body = {
            code: status.code,
            msg: status.msg,
            data
        };
        return;
    };
    await next();
};
