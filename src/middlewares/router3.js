const fs = require('fs');
const path = require('path');
const debug = require('debug');
const glob = require('glob');
const isPlainObject = require('lodash/isPlainObject');
const isFunction = require('lodash/isFunction');
const { parseRequest } = require('../lib/util');

const routerDebug = debug('zan:router');

function getAllControllers(basePath) {
    let controllers = {};
    let files = glob.sync(`${basePath}/**/*.js`);
    files = files.filter((item) => {
        return item.indexOf('controllers') > -1;
    });
    for (let i = 0; i < files.length; i++) {
        let requireContent = require(files[i]);
        let key = files[i].split('src/')[1].replace('/controllers', '');

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

module.exports = (config) => {
    let controllers = getAllControllers(config.SRC_PATH);
    routerDebug(controllers);

    return async(ctx, next) => {
        let requestDesc = parseRequest(ctx);

        routerDebug(requestDesc);
        if (controllers[requestDesc.file] && controllers[requestDesc.file].controller[requestDesc.funcName]) {
            await controllers[requestDesc.file].controller[requestDesc.funcName](ctx, next);
        } else {
            await next();
        }
    }
};