const ajax = require('axios');

module.exports = async(ctx, next) => {
  if (ctx.path === '/_HB_') {
    try {
      const result = await ajax({
        url: 'http://127.0.0.1:8680/_HB_',
        data: ctx.query
      });
      if (result.status === 200 && result.data.code === 200) {
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
        ctx.status = 404;
        ctx.body = {
          result: true,
          code: 404,
          message: null,
          data: 'ok'
        };
      }
    } catch (e) {
      ctx.status = 404;
      ctx.body = {
        result: true,
        code: 404,
        message: e.message,
        data: 'ok'
      };
    }
  } else {
    await next();
  }
};