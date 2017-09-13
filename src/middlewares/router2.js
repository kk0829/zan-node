import fs from 'fs';
import path from 'path';
import debug from 'debug';
import isPlainObject from 'lodash/isPlainObject';
import isFunction from 'lodash/isFunction';
import { parseRequest } from '../lib/util';

const routerDebug = debug('zan:router');

function getAllControllers(basePath, controllers = {}) {
    const items = fs.readdirSync(basePath)
        .filter((item) => {
            return item.indexOf('.') !== 0
        });

    for (let i = 0; i < items.length; i++) {
        let absolutePath = path.join(basePath, items[i]);
        let stat = fs.statSync(absolutePath);
        if (stat.isDirectory()) {
            getAllControllers(absolutePath, controllers);
        } else if (stat.isFile() && items[i].indexOf('.js') === items[i].length - 3) {
            let requireContent = require(absolutePath);
            let key = absolutePath.split('controllers/')[1];

            if (isFunction(requireContent)) {
                controllers[key] = {
                    controller: new requireContent()
                };
            } else if (isPlainObject(requireContent) && requireContent.default) {
                if (isFunction(requireContent.default)) {
                    controllers[key] = {
                        controller: new requireContent.default()
                    };
                } else {
                    controllers[key] = {
                        controller: requireContent.default
                    };
                }
            } else {
                controllers[key] = {
                    controller: requireContent
                };
            }
        }
    }

    return controllers;
};

/**
 * .json 结尾的表示接口请求
 * .html 或无后缀的表示页面请求
 */
module.exports = (config) => {
    let controllers = getAllControllers(config.CONTROLLERS_PATH);
    routerDebug(controllers);

    return async (ctx, next) => {
        let requestDesc = parseRequest(ctx);
        
        routerDebug(requestDesc);
        if (controllers[requestDesc.file] && controllers[requestDesc.file].controller[requestDesc.funcName]) {
            await controllers[requestDesc.file].controller[requestDesc.funcName](ctx, next);
        } else {
            await next();
        }
    };
};
