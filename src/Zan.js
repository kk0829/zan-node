import path from 'path';
import Koa from 'koa';
import debug from 'debug';
import defaultsDeep from 'lodash/defaultsDeep';
import uniq from 'lodash/uniq';
import ip from 'ip';
import boxen from 'boxen';
import middlewares from './config/middlewares';
import router2 from './middlewares/router2';
import router from './middlewares/router';
import pkg from '../package.json';
import BusinessError from './base/BusinessError';
import ParamsError from './base/ParamsError';
import Validator from './base/Validator';
import Controller from './base/Controller';
import Service from './base/Service';
import Router from 'koa-router';

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
            afterLoadMiddlewares() {}
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
        let VERSION_LIST = this.config.VERSION_LIST || [];
        delete this.config.VERSION_LIST;
        this.config = defaultsDeep({}, config, this.defaultConfig);
        this.config.VERSION_LIST = this.config.VERSION_LIST.concat(VERSION_LIST);
        this.middlewares = middlewares(this.config);

        this.app = new Koa();
        this.app.config = this.config;
        this.app.keys = this.config.KEYS;
        this.app.env = this.NODE_ENV;

        this.loadVersionMap();
        this.loadMiddlewares();

        return this;
    }

    loadVersionMap() {
        let VERSION_LIST = this.config.VERSION_LIST;
        let VERSION_MAP = {};

        for (let i = 0; i < VERSION_LIST.length; i++) {
            if (!path.isAbsolute(VERSION_LIST[i])) {
                VERSION_LIST[i] = path.resolve(this.SERVER_ROOT, VERSION_LIST[i]);
            }
        }
        VERSION_LIST = uniq(VERSION_LIST);

        for (let i = 0; i < VERSION_LIST.length; i++) {
            let parsed = path.parse(VERSION_LIST[i]);
            VERSION_MAP[parsed.name] = require(VERSION_LIST[i]);
        }
        this.config.VERSION_MAP = VERSION_MAP;
        this.config.VERSION_LIST = VERSION_LIST;
    }

    loadMiddlewares() {
        const middlewareDebug = debug('zan:middleware');
        this.config.beforeLoadMiddlewares.call(this);
        for (let i = 0; i < this.middlewares.length; i++) {
            middlewareDebug(this.middlewares[i].name);
            this.app.use(this.middlewares[i].fn);
        }
        this.config.afterLoadMiddlewares.call(this);

        (this.config.ES7_ROUTER ? router2 : router)({
            app: this.app,
            path: this.config.ROUTERS_PATH
        });

        let defaultErrorCallback = (err) => {
            console.log('<ERROR>');
            console.log(err);
        };

        this.app.on('error', this.config.ERROR_CALLBACK || defaultErrorCallback);

        this.app.listen(this.NODE_PORT, () => {
            if (this.NODE_ENV === 'development') {
                let msg = `
    Serving!

        - Zan框架版本：         ${pkg.version}
        - NODE_ENV:             ${this.NODE_ENV}
        - NODE_PORT:            ${this.NODE_PORT}
        - Local:                http://127.0.0.1:${this.NODE_PORT}
        - On Your Network:      http://${ip.address()}:${this.NODE_PORT}

            Copied local address to clipboard!`;
                console.log(boxen(msg, {
                    padding: {
                        left: 0,
                        right: 4,
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

export default Zan;
