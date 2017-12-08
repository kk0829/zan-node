module.exports = async function mixin(ctx, next) {
    ctx.beforeRenderFns = ctx.beforeRenderFns || [];
    ctx.state = ctx.state || {};
    ctx.state.global = ctx.state.global || {};

    await next();
};