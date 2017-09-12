'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

var _uniq = require('lodash/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

var _ip = require('ip');

var _ip2 = _interopRequireDefault(_ip);

var _boxen = require('boxen');

var _boxen2 = _interopRequireDefault(_boxen);

var _middlewares = require('./config/middlewares');

var _middlewares2 = _interopRequireDefault(_middlewares);

var _router = require('./middlewares/router');

var _router2 = _interopRequireDefault(_router);

var _router3 = require('./middlewares/router2');

var _router4 = _interopRequireDefault(_router3);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _BusinessError = require('./base/BusinessError');

var _BusinessError2 = _interopRequireDefault(_BusinessError);

var _ParamsError = require('./base/ParamsError');

var _ParamsError2 = _interopRequireDefault(_ParamsError);

var _Validator = require('./base/Validator');

var _Validator2 = _interopRequireDefault(_Validator);

var _Controller = require('./base/Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _Service = require('./base/Service');

var _Service2 = _interopRequireDefault(_Service);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _env = require('./middlewares/nunjucks/env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Zan {

    get defaultConfig() {
        return {
            KEYS: ['im a newer secret', 'i like turtle'],
            NODE_ENV: this.NODE_ENV,
            NODE_PORT: this.NODE_PORT,
            FAVICON_PATH: _path2.default.join(this.SERVER_ROOT, 'favicon.ico'),
            STATIC_PATH: _path2.default.join(this.SERVER_ROOT, '../static'),
            CODE_PATH: _path2.default.join(this.SERVER_ROOT, 'constants/code.js'),
            CONFIG_PATH: _path2.default.join(this.SERVER_ROOT, 'config'),
            SEO_PATH: _path2.default.join(this.SERVER_ROOT, 'constants/site.js'),
            VIEW_PATH: _path2.default.join(this.SERVER_ROOT, 'views'),
            ROUTERS_PATH: _path2.default.join(this.SERVER_ROOT, 'routes'),
            CONTROLLERS_PATH: _path2.default.join(this.SERVER_ROOT, 'controllers'),
            XSS_WHITELISTS: [],
            CDN_PATH: '//www.cdn.com',
            beforeLoadMiddlewares() {},
            afterLoadMiddlewares() {},
            MIDDLEWARES_PATH: _path2.default.join(this.SERVER_ROOT, 'middlewares')
        };
    }

    constructor(config) {
        this.config = config || {};
        this.config.SERVER_ROOT = this.config.SERVER_ROOT || _path2.default.join(process.cwd(), 'server');
        this.SERVER_ROOT = this.config.SERVER_ROOT;
        if (this.config.STATIC_PATH) {
            this.config.STATIC_PATH = _path2.default.join(this.SERVER_ROOT, this.config.STATIC_PATH);
        }
        this.NODE_ENV = process.env.NODE_ENV || this.config.NODE_ENV || 'development';
        this.NODE_PORT = process.env.NODE_PORT || this.config.NODE_PORT || 8201;
        this.config.ZAN_VERSION = _package2.default.version;
        this.config = (0, _defaultsDeep2.default)({}, config, this.defaultConfig);
        this.middlewares = (0, _middlewares2.default)(this.config);

        this.app = new _koa2.default();
        this.app.config = this.config;
        this.app.keys = this.config.KEYS;
        this.app.env = this.NODE_ENV;

        this.loadVersionMap();
        this.run();

        return this;
    }

    // 自动加载静态资源 Version 文件
    loadVersionMap() {
        let versionFiles = _fs2.default.readdirSync(this.config.CONFIG_PATH).filter(item => {
            return (/^version.*\.json$/.test(item)
            );
        });
        let VERSION_LIST = [];
        let VERSION_MAP = {};
        for (let i = 0; i < versionFiles.length; i++) {
            VERSION_LIST[i] = _path2.default.join(this.config.CONFIG_PATH, versionFiles[i]);
        }

        for (let i = 0; i < VERSION_LIST.length; i++) {
            let parsed = _path2.default.parse(VERSION_LIST[i]);
            VERSION_MAP[parsed.name] = require(VERSION_LIST[i]);
        }

        this.config.VERSION_MAP = VERSION_MAP;
        this.config.VERSION_LIST = VERSION_LIST;
    }

    // 自动加载业务中间件
    // >= 0.0.17 自动加载
    // 低版本 手动在 server/app.js 下配置
    autoLoadMiddlewares() {
        const middlewareDebug = (0, _debug2.default)('zan:middleware');
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
        this.config.afterLoadMiddlewares.call(this);
    }

    run() {
        this.autoLoadMiddlewares();

        (0, _router2.default)({
            app: this.app,
            path: this.config.ROUTERS_PATH
        });
        this.app.use((0, _router4.default)(this.config));

        let defaultErrorCallback = err => {
            console.log('<ERROR>');
            console.log(err);
        };

        this.app.on('error', this.config.ERROR_CALLBACK || defaultErrorCallback);

        this.app.listen(this.NODE_PORT, () => {
            if (this.NODE_ENV === 'development') {
                let msg = `服务启动成功!

- Zan框架版本：         ${_package2.default.version}
- NODE_ENV:             ${this.NODE_ENV}
- NODE_PORT:            ${this.NODE_PORT}
- Local:                http://127.0.0.1:${this.NODE_PORT}
- On Your Network:      http://${_ip2.default.address()}:${this.NODE_PORT}`;
                if (process.env.HTTP_PROXY && process.env.HTTPS_PROXY) {
                    msg += `\n- HTTP_PROXY            ${process.env.HTTP_PROXY}`;
                    msg += `\n- HTTPS_PROXY           ${process.env.HTTPS_PROXY}`;
                }
                console.log((0, _boxen2.default)(msg, {
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

exports.BusinessError = _BusinessError2.default;
exports.ParamsError = _ParamsError2.default;
exports.Validator = _Validator2.default;
exports.validator = new _Validator2.default();
exports.router = new _koaRouter2.default();
exports.Controller = _Controller2.default;
exports.Service = _Service2.default;
exports.viewEnv = _env2.default;

exports.default = Zan;