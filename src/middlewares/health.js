module.exports = function() {
    return async function health(ctx, next) {
        if (ctx.path === '/_HB_') {
            if (ctx.query.service === 'online') {
                ctx.status = 200;
                ctx.body = {
                    result: true,
                    code: 200,
                    message: null,
                    data: 'ok'
                };
            } else if (ctx.query.service === 'offline') {
                ctx.status = 404;
                ctx.body = {
                    result: true,
                    code: 404,
                    message: null,
                    data: 'ok'
                };
            } else {
                ctx.status = 200;
                ctx.body = {
                    result: true,
                    code: 200,
                    message: null,
                    data: 'ok'
                };
            }
        } else {
            await next();
        }
    }
}