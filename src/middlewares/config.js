import lodash from 'lodash';

/**
 * @param {String} config.path 配置文件目录
 * @param {String} config.NODE_ENV 环境变量
 */
module.exports = function (config) {
    config = config || {};
    config.NODE_ENV = config.NODE_ENV || 'development';
    const commonConfig = require(`${config.path}/common.js`);
    const envConfig = require(`${config.path}/config.${config.NODE_ENV}.js`);
    const obj = lodash.defaultsDeep({}, envConfig, commonConfig);
    return async (ctx, next) => {
        ctx.getConfig = function (name) {
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
