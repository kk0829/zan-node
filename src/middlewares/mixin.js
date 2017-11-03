module.exports = async(ctx, next) => {
    ctx.beforeRenderFns = ctx.beforeRenderFns || [];
    ctx.state = ctx.state || {};
    ctx.state.global = ctx.state.global || {};

    await next();
};