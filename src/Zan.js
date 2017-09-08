import path from 'path';
import fs from 'fs';
import Koa from 'koa';
import debug from 'debug';
import defaultsDeep from 'lodash/defaultsDeep';
import uniq from 'lodash/uniq';
import ip from 'ip';
import boxen from 'boxen';
import middlewares from './config/middlewares';
import router from './middlewares/router';
import router2 from './middlewares/router2';
import router3 from './middlewares/router3';
import pkg from '../package.json';
import BusinessError from './base/BusinessError';
import ParamsError from './base/ParamsError';
import Validator from './base/Validator';
import Controller from './base/Controller';
import Service from './base/Service';
import Router from 'koa-router';
import { viewEnv } from './middlewares/nunjucks';

class Zan {

    get defaultConfig() {
        return {
            KEYS: ['im a newer secret', 'i like turtle'],
            NODE_ENV: this.NODE_ENV,
            NODE_PORT: this.NODE_PORT,
            FAVICON_PATH: path.join(this.SERVER_ROOT, 'favicon.ico'),
            STATIC_PATH: path.join(this.SERVER_ROOT, '../static'),
            CODE_PATH: path.join(this.SERVER_ROOT, 'constants/code.js'),
            CONFIG_PATH: path.join(this.SERVER_ROOT, 'config'),
            SEO_PATH: path.join(this.SERVER_ROOT, 'constants/site.js'),
            VIEW_PATH: path.join(this.SERVER_ROOT, 'views'),
            VIEW_EXTRA_DATA: {
                env: this.NODE_ENV,
                version_css: require(path.join(this.SERVER_ROOT, 'config/version_css.json')),
                version_js: require(path.join(this.SERVER_ROOT, 'config/version_js.json'))
            },
            VERSION_LIST: [
                path.join(this.SERVER_ROOT, 'config/version_css.json'),
                path.join(this.SERVER_ROOT, 'config/version_js.json')
            ],
            ROUTERS_PATH: path.join(this.SERVER_ROOT, 'routes'),
            CONTROLLERS_PATH: path.join(this.SERVER_ROOT, 'controllers'),
            XSS_WHITELISTS: [],
            ES7_ROUTER: false,
            CDN_PATH: '//www.cdn.com',
            beforeLoadMiddlewares() {},
            afterLoadMiddlewares() {},
            MIDDLEWARES_PATH: path.join(this.SERVER_ROOT, 'middlewares')
        };
    }

    constructor(config) {
        this.config = config || {};
        if (!this.config.SERVER_ROOT) {
            console.error('配置参数 SERVER_ROOT 不能为空');
            return;
        }
        this.SERVER_ROOT = this.config.SERVER_ROOT;
        if (this.config.STATIC_PATH) {
            this.config.STATIC_PATH = path.join(this.SERVER_ROOT, this.config.STATIC_PATH);
        }
        this.NODE_ENV = process.env.NODE_ENV || this.config.NODE_ENV || 'development';
        this.NODE_PORT = process.env.NODE_PORT || this.config.NODE_PORT || 8201;
        this.config.ZAN_VERSION = pkg.version;
        this.config = defaultsDeep({}, config, this.defaultConfig);
        this.middlewares = middlewares(this.config);

        this.app = new Koa();
        this.app.config = this.config;
        this.app.keys = this.config.KEYS;
        this.app.env = this.NODE_ENV;

        this.loadVersionMap();
        this.loadMiddlewares();

        return this;
    }

    // 自动加载静态资源 Version 文件
    loadVersionMap() {
        let versionFiles = fs.readdirSync(this.config.CONFIG_PATH)
            .filter((item) => {
                return /^version.*\.json$/.test(item);
            });
        let VERSION_LIST = [];
        let VERSION_MAP = {};
        for (let i = 0; i < versionFiles.length; i++) {
            VERSION_LIST[i] = path.join(this.config.CONFIG_PATH, versionFiles[i]);
        }

        for (let i = 0; i < VERSION_LIST.length; i++) {
            let parsed = path.parse(VERSION_LIST[i]);
            VERSION_MAP[parsed.name] = require(VERSION_LIST[i]);
        }

        this.config.VERSION_MAP = VERSION_MAP;
        this.config.VERSION_LIST = VERSION_LIST;
    }

    // 自动加载业务中间件
    // >= 0.0.17 自动加载
    // 低版本 手动在 server/app.js 下配置
    autoLoadMiddlewares() {
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
    }

    loadMiddlewares() {
        const middlewareDebug = debug('zan:middleware');
        this.autoLoadMiddlewares();
        
        for (let i = 0; i < this.middlewares.length; i++) {
            middlewareDebug(this.middlewares[i].name);
            this.app.use(this.middlewares[i].fn);
        }
        this.config.afterLoadMiddlewares.call(this);

        (this.config.ES7_ROUTER ? router2 : router)({
            app: this.app,
            path: this.config.ROUTERS_PATH
        });
        this.app.use(router3(this.config));

        let defaultErrorCallback = (err) => {
            console.log('<ERROR>');
            console.log(err);
        };

        this.app.on('error', this.config.ERROR_CALLBACK || defaultErrorCallback);

        this.app.listen(this.NODE_PORT, () => {
            if (this.NODE_ENV === 'development') {
                let msg = `服务启动成功!

- Zan框架版本：         ${pkg.version}
- NODE_ENV:             ${this.NODE_ENV}
- NODE_PORT:            ${this.NODE_PORT}
- Local:                http://127.0.0.1:${this.NODE_PORT}
- On Your Network:      http://${ip.address()}:${this.NODE_PORT}`;
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
                console.log(`NODE_ENV = ${this.NODE_ENV}`);
                console.log(`NODE_PORT = ${this.NODE_PORT}`);
            }
        });
    }
}

exports.BusinessError = BusinessError;
exports.ParamsError = ParamsError;
exports.Validator = Validator;
exports.validator = new Validator();
exports.router = new Router();
exports.Controller = Controller;
exports.Service = Service;
exports.viewEnv = viewEnv;

export default Zan;
