'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const defaultsDeep = require('lodash/defaultsDeep');
const { getInstance } = require('../lib/util');

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
        if (NODE_ENV === 'production' || NODE_ENV === 'prod') {
            if (fs.existsSync(`${CONFIG_PATH}/config.production.js`)) {
                envConfig = require(`${CONFIG_PATH}/config.production.js`);
            } else if (fs.existsSync(`${CONFIG_PATH}/config.prod.js`)) {
                envConfig = require(`${CONFIG_PATH}/config.prod.js`);
            }
        } else if (fs.existsSync(`${CONFIG_PATH}/config.${NODE_ENV}.js`)) {
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

    // 自动加载所有 Controllers 文件，挂载到 app.controllers 下面
    loadControllers() {
        if (!fs.existsSync(this.config.CONTROLLERS_PATH)) {
            return;
        }
        let controllers = {};
        const files = glob.sync(`${this.config.CONTROLLERS_PATH}/**/*.js`);

        for (let i = 0; i < files.length; i++) {
            const requireContent = require(files[i]);
            const instance = getInstance(requireContent);
            const arr = files[i].split('controllers/')[1].split('.js')[0].split('/');
            let pointer = controllers;
            let item;
            while (item = arr.shift()) {
                if (arr.length === 0) {
                    pointer[item] = instance;
                } else {
                    pointer[item] = pointer[item] || {};
                    pointer = pointer[item];
                }
            }
        }

        return controllers;
    }

    // 自动加载所有 server/middlewares 下的中间件，挂载到 app.businessMiddlewares
    loadMiddlewares() {
        if (!fs.existsSync(this.config.MIDDLEWARES_PATH)) return;
        let middlewares = [];
        const files = glob.sync(`${this.config.MIDDLEWARES_PATH}/**/*.js`);
        for (let i = 0; i < files.length; i++) {
            const fn = require(files[i]);
            if (typeof fn === 'function') {
                middlewares.push({
                    name: files[i].split(this.config.MIDDLEWARES_PATH + '/')[1].slice(0, -3).replace('/', '.'),
                    fn: fn,
                    type: 'business'
                });
            }
        }
        return middlewares;
    }
}

module.exports = Loader;