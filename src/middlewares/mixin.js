const { parseRequest } = require('../lib/util');

module.exports = async function mixin(ctx, next) {
    ctx.requestDesc = parseRequest(ctx);
    ctx.finalPath = ctx.requestDesc.finalPath;
    ctx.beforeRenderFns = ctx.beforeRenderFns || [];
    ctx.state = ctx.state || {};
    ctx.state.global = ctx.state.global || {};
    ctx.sessionCache = ctx.sessionCache || {};

    await next();
};