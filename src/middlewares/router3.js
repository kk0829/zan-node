import fs from 'fs';
import path from 'path';
import debug from 'debug';
import isPlainObject from 'lodash/isPlainObject';
import isFunction from 'lodash/isFunction';
import { parseRequest } from '../lib/util';

const routerDebug = debug('zan:router');

function getAllControllers(basePath) {
    let controllers = {};
    const items = fs.readdirSync(basePath)
        .filter((item) => {
            return item.indexOf('.') !== 0
        });

    for (let i = 0; i < items.length; i++) {
        let absolutePath = path.join(basePath, `${items[i]}/controllers`);
        let stat = fs.statSync(absolutePath);
        if (stat.isDirectory()) {
            const files = fs.readdirSync(absolutePath)
                .filter((item) => {
                    return item.indexOf('.') !== 0 && /.js$/.test(item);
                });

            for (let j = 0; j < files.length; j++) {
                let filePath = `${absolutePath}/${files[j]}`;
                let requireContent = require(filePath);
                let key = filePath.split('src/')[1].replace('/controllers', '');

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