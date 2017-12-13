'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * 根据路由配置路由
	module.exports = [
	    ['GET', '/showcase/feature/detail.json', 'showcase.feature', 'getFeatureDetailJson']
	];
 */
const glob = require('glob');
const debug = require('debug');
const isFunction = require('lodash/isFunction');
const toRegexp = require('path-to-regexp');
const { parseRequest } = require('../lib/util');
const router = require('../lib/router');

const routerDebug = debug('zan:router4');

module.exports = (app, config) => {
    const controllers = app.allControllers;
    let routerConfig = [];
    routerDebug(controllers);

    const files = glob.sync(`${config.ROUTERS_PATH}/**/*.js`);
    for (let i = 0; i < files.length; i++) {
        const requireContent = require(files[i]);
        const type = Object.prototype.toString.call(requireContent);
        if (type === '[object Array]') {
            routerConfig = routerConfig.concat(requireContent);
        }
    }
    console.log(routerConfig);

    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            const requestDesc = parseRequest(ctx);
            routerDebug(requestDesc);

            const fineOne = routerConfig.find(function (item) {
                return item[0].toUpperCase() === requestDesc.method && toRegexp(item[1]).test(requestDesc.path);
            });
            routerDebug(fineOne);
            if (fineOne) {
                const file = fineOne[2].replace('.', '/') + '.js';
                const match = controllers[file];
                const funcName = fineOne[3];
                if (match) {
                    if (isFunction(match.controller)) {
                        const Controller = match.controller;
                        const instance = new Controller(ctx);
                        if (instance[funcName]) {
                            yield instance[funcName](ctx, next);
                        } else {
                            yield next();
                        }
                    } else if (match.controller[funcName]) {
                        yield match.controller[funcName](ctx, next);
                    } else {
                        yield next();
                    }
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