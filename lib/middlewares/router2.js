'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const debug = require('debug')('zan:router2');
const isFunction = require('lodash/isFunction');
const { parseRequest } = require('../lib/util');

/**
 * .json 结尾的表示接口请求
 * .html 或无后缀的表示页面请求
 */
module.exports = app => {
    const controllers = app.controllers;
    debug(controllers);

    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            let requestDesc = parseRequest(ctx);

            debug(requestDesc);
            const match = controllers[requestDesc.file];
            if (match) {
                if (isFunction(match.controller)) {
                    const Controller = match.controller;
                    const instance = new Controller(ctx);
                    if (instance[requestDesc.funcName]) {
                        yield instance[requestDesc.funcName](ctx, next);
                    } else {
                        yield next();
                    }
                } else if (match.controller[requestDesc.funcName]) {
                    yield match.controller[requestDesc.funcName](ctx, next);
                } else {
                    yield next();
                }
            } else {
                yield next();
            }
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })();
};