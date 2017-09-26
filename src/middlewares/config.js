import lodash from 'lodash';
import fs from 'fs';

module.exports = function(config = {}) {
    const CONFIG_PATH = config.CONFIG_PATH;
    const NODE_ENV = config.NODE_ENV;
    let defaultConfig = {};
    let envConfig = {};

    if (fs.existsSync(`${CONFIG_PATH}/common.js`)) {
        defaultConfig = require(`${CONFIG_PATH}/common.js`);
    } else if (fs.existsSync(`${CONFIG_PATH}/config.default.js`)) {
        defaultConfig = require(`${CONFIG_PATH}/config.default.js`);
    }

    if (fs.existsSync(`${CONFIG_PATH}/config.${NODE_ENV}.js`)) {
        envConfig = require(`${CONFIG_PATH}/config.${NODE_ENV}.js`);
    }

    const obj = lodash.defaultsDeep({}, envConfig, defaultConfig);
    return async(ctx, next) => {
        ctx.getConfig = function(name) {
            let arr = name.split('.');
            let result = obj;
            let i = 0;
            while (arr[i]) {
                result = result[arr[i]];
                i++;
            }
            return result;
        };
        await next();
    };
};