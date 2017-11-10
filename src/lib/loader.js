const fs = require('fs');
const path = require('path');
const glob = require('glob');
const debug = require('debug');
const defaultsDeep = require('lodash/defaultsDeep');

/**
 * 加载器
 */
class Loader {

    constructor(config) {
        this.config = config;
    }

    // 加载项目配置信息
    // config.default.js / common.js
    // config.${NODE_ENV}.js
    loadProjectConfig() {
        const CONFIG_PATH = this.config.CONFIG_PATH;
        const NODE_ENV = this.config.NODE_ENV;
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

        return defaultsDeep({}, envConfig, defaultConfig);
    }

    // 自动加载静态资源 Version 文件
    loadVersionMap() {
        const VERSION_LIST = glob.sync(`${this.config.CONFIG_PATH}/version*.json`);
        let VERSION_MAP = {};

        for (let i = 0; i < VERSION_LIST.length; i++) {
            let parsed = path.parse(VERSION_LIST[i]);
            VERSION_MAP[parsed.name] = require(VERSION_LIST[i]);
        }

        return VERSION_MAP;
    }
}

module.exports = Loader;