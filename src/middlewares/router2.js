const debug = require('debug')('zan:router2');
const isFunction = require('lodash/isFunction');
const { parseRequest } = require('../lib/util');

/**
 * .json 结尾的表示接口请求
 * .html 或无后缀的表示页面请求
 */
module.exports = (app) => {
    const controllers = app.controllers;
    debug(controllers);

    return async(ctx, next) => {
        let requestDesc = parseRequest(ctx);

        debug(requestDesc);
        const match = controllers[requestDesc.file];
        if (match) {
            if (isFunction(match.controller)) {
                const Controller = match.controller;
                const instance = new Controller(ctx);
                if (instance[requestDesc.funcName]) {
                    await instance[requestDesc.funcName](ctx, next);
                } else {
                    await next();
                }
            } else if (match.controller[requestDesc.funcName]) {
                await match.controller[requestDesc.funcName](ctx, next);
            } else {
                await next();
            }
        } else {
            await next();
        }
    };
};