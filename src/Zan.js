const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const debug = require('debug');
const defaultsDeep = require('lodash/defaultsDeep');
const ip = require('ip');
const boxen = require('boxen');
const middlewares = require('./middlewares');
const router = require('./middlewares/router');
const router2 = require('./middlewares/router2');
const router3 = require('./middlewares/router3');
const pkg = require('../package.json');
const {
    BusinessError,
    ParamsError,
    Exception_404
} = require('./base/Error');
const Validator = require('./base/Validator');
const Controller = require('./base/Controller');
const Service = require('./base/Service');
const Router = require('koa-router');
const viewEnv = require('./middlewares/nunjucks/env');
const rewrite = require('./middlewares/rewrite');
const code = require('./middlewares/code');
const body = require('./middlewares/body');
const koaStatic = require('./middlewares/static');
const Emitter = require('events');
const Loader = require('./lib/loader');

// 加载扩展
require('./extend/context');

class Zan extends Emitter {

    // 默认配置
    get defaultConfig() {
        const SERVER_ROOT = this.config.SERVER_ROOT;
        return {
            KEYS: ['im a newer secret', 'i like turtle'],
            NODE_ENV: 'development',
            NODE_PORT: 8201,
            FAVICON_PATH: path.resolve(SERVER_ROOT, 'favicon.ico'),
            STATIC_PATH: path.resolve(SERVER_ROOT, '../static'),
            CODE_PATH: path.resolve(SERVER_ROOT, 'constants/code.js'),
            CONFIG_PATH: path.resolve(SERVER_ROOT, 'config'),
            SEO_PATH: path.resolve(SERVER_ROOT, 'constants/site.js'),
            VIEW_PATH: path.resolve(SERVER_ROOT, 'views'),
            ROUTERS_PATH: path.resolve(SERVER_ROOT, 'routes'),
            CONTROLLERS_PATH: path.resolve(SERVER_ROOT, 'controllers'),
            XSS_WHITELISTS: [],
            CDN_PATH: '//www.cdn.com',
            beforeLoadMiddlewares() {},
            MIDDLEWARES_PATH: path.resolve(SERVER_ROOT, 'middlewares'),
            MIDDLEWARES_CONFIG_PATH: path.resolve(SERVER_ROOT, 'config/middlewares.js'),
            // iron 目录结构
            IRON_DIR: false,
            SRC_PATH: path.resolve(SERVER_ROOT, 'src'),
            // 所有中间件（框架+业务中间件）可配，默认 false
            AUTO_MIDDLEWARE: false
        };
    }

    // 环境变量配置
    get envConfig() {
        return {
            NODE_ENV: process.env.NODE_ENV,
            NODE_PORT: process.env.NODE_PORT
        };
    }

    // 运行根目录
    get defaultServerRoot() {
        let defaultServerRoot;
        if (/server_dist|bin/.test(process.mainModule.filename)) {
            defaultServerRoot = path.resolve(process.cwd(), 'server_dist');
        } else {
            defaultServerRoot = path.resolve(process.cwd(), 'server');
        }
        return defaultServerRoot;
    }

    constructor(config) {
        super();
        this.config = config || {};
        this.config.SERVER_ROOT = this.config.SERVER_ROOT || this.defaultServerRoot;
        if (this.config.STATIC_PATH) {
            this.config.STATIC_PATH = path.resolve(this.config.SERVER_ROOT, this.config.STATIC_PATH);
        }
        this.config = defaultsDeep({}, this.envConfig, this.config, this.defaultConfig);

        process.env.NODE_ENV = this.config.NODE_ENV;
        process.env.NODE_PORT = this.config.NODE_PORT;

        this.app = new Koa();
        this.app.config = this.config;
        this.app.keys = this.config.KEYS;
        this.app.env = this.config.NODE_ENV;

        this.middlewares = middlewares(this.config);
        // 初始化加载器
        this.loader = new Loader(this.config);
        // 加载项目配置
        this.app.projectConfig = this.loader.loadProjectConfig();
        // 加载 Version 文件
        this.config.VERSION_MAP = this.loader.loadVersionMap();
        // 加载 Controllers 文件
        this.app.controllers = this.loader.loadControllers();
        // 加载目录 server/middlewares 下的所有中间件
        this.app.businessMiddlewares = this.loader.loadMiddlewares();
        // ZanNode version
        this.config.ZAN_VERSION = pkg.version;
        // 把框架中间件跟业务中间件都合并到 allMiddlewares
        this.allMiddlewares = [].concat(this.middlewares).concat(this.app.businessMiddlewares);

        this.run();
        return this;
    }

    // 自动加载业务中间件
    // >= 0.0.17 自动加载
    // 低版本 手动在 server/app.js 下配置
    autoLoadMiddlewares() {
        const middlewareDebug = debug('zan:middleware');
        const middlewares = require(this.config.MIDDLEWARES_PATH);
        if (Array.isArray(middlewares)) {
            for (let i = 0; i < middlewares.length; i++) {
                this.middlewares.push({
                    name: middlewares[i].name || 'anonymous',
                    fn: middlewares[i]
                });
            }
        } else {
            this.config.beforeLoadMiddlewares.call(this);
        }

        for (let i = 0; i < this.middlewares.length; i++) {
            middlewareDebug(this.middlewares[i].name);
            this.app.use(this.middlewares[i].fn);
        }
    }

    run() {
        if (this.config.AUTO_MIDDLEWARE) {

        } else {
            this.autoLoadMiddlewares();
        }

        // 路由1：自定义路由方式1
        router({
            app: this.app,
            ROUTERS_PATH: this.config.ROUTERS_PATH
        });
        // 路由3：根据目录结构路由
        if (this.config.IRON_DIR) {
            this.app.use(router3(this.config));
        } else {
            this.app.use(router2(this.config));
        }

        let defaultErrorCallback = (err) => {
            console.log('<defaultErrorCallback>');
            console.log(err);
        };

        this.app.on('error', this.config.ERROR_CALLBACK || defaultErrorCallback);

        this.app.listen(this.config.NODE_PORT, () => {
            this.emit('start');
            if (this.config.NODE_ENV === 'development') {
                let msg = `服务启动成功!

- Zan框架版本：         ${this.config.ZAN_VERSION}
- NODE_ENV:             ${this.config.NODE_ENV}
- NODE_PORT:            ${this.config.NODE_PORT}
- Local:                http://127.0.0.1:${this.config.NODE_PORT}
- On Your Network:      http://${ip.address()}:${this.config.NODE_PORT}`;
                if (process.env.HTTP_PROXY && process.env.HTTPS_PROXY) {
                    msg += `\n- HTTP_PROXY            ${process.env.HTTP_PROXY}`;
                    msg += `\n- HTTPS_PROXY           ${process.env.HTTPS_PROXY}`;
                }
                console.log(boxen(msg, {
                    padding: {
                        left: 2,
                        right: 2,
                        top: 0,
                        bottom: 1
                    },
                    margin: 1,
                    borderColor: 'green',
                    borderStyle: 'classic'
                }));
            } else {
                console.log(`NODE_ENV = ${this.config.NODE_ENV}`);
                console.log(`NODE_PORT = ${this.config.NODE_PORT}`);
            }
        });
    }
}

module.exports = Zan;

module.exports.BusinessError = BusinessError;
module.exports.ParamsError = ParamsError;
module.exports.Exception_404 = Exception_404;
module.exports.Validator = Validator;
module.exports.validator = new Validator();
module.exports.router = new Router();
module.exports.Controller = Controller;
module.exports.Service = Service;
module.exports.viewEnv = viewEnv;
module.exports.rewrite = rewrite;
module.exports.middlewares = {
    code,
    body,
    koaStatic,
    ironRouter: router3
};