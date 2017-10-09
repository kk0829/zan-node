import fs from 'fs';
import path from 'path';
import debug from 'debug';
import glob from 'glob';
import isPlainObject from 'lodash/isPlainObject';
import isFunction from 'lodash/isFunction';
import { parseRequest } from '../lib/util';

const routerDebug = debug('zan:router');

function getAllControllers(basePath) {
    let controllers = {};
    let files = glob.sync(`${basePath}/**/*.js`);

    for (let i = 0; i < files.length; i++) {
        let requireContent = require(files[i]);
        let key = files[i].split('controllers/')[1];

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
    return controllers;
};

/**
 * .json 结尾的表示接口请求
 * .html 或无后缀的表示页面请求
 */
module.exports = (config) => {
    let controllers = getAllControllers(config.CONTROLLERS_PATH);
    routerDebug(controllers);

    return async(ctx, next) => {
        let requestDesc = parseRequest(ctx);

        routerDebug(requestDesc);
        if (controllers[requestDesc.file] && controllers[requestDesc.file].controller[requestDesc.funcName]) {
            await controllers[requestDesc.file].controller[requestDesc.funcName](ctx, next);
        } else {
            await next();
        }
    };
};