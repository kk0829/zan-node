'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

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

var _router5 = require('./middlewares/router3');

var _router6 = _interopRequireDefault(_router5);

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
            VIEW_EXTRA_DATA: {
                env: this.NODE_ENV,
                version_css: require(_path2.default.join(this.SERVER_ROOT, 'config/version_css.json')),
                version_js: require(_path2.default.join(this.SERVER_ROOT, 'config/version_js.json'))
            },
            VERSION_LIST: [_path2.default.join(this.SERVER_ROOT, 'config/version_css.json'), _path2.default.join(this.SERVER_ROOT, 'config/version_js.json')],
            ROUTERS_PATH: _path2.default.join(this.SERVER_ROOT, 'routes'),
            CONTROLLERS_PATH: _path2.default.join(this.SERVER_ROOT, 'controllers'),
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
            this.config.STATIC_PATH = _path2.default.join(this.SERVER_ROOT, this.config.STATIC_PATH);
        }
        this.NODE_ENV = process.env.NODE_ENV || this.config.NODE_ENV || 'development';
        this.NODE_PORT = process.env.NODE_PORT || this.config.NODE_PORT || 8201;
        this.config.ZAN_VERSION = _package2.default.version;
        let VERSION_LIST = this.config.VERSION_LIST || [];
        delete this.config.VERSION_LIST;
        this.config = (0, _defaultsDeep2.default)({}, config, this.defaultConfig);
        this.config.VERSION_LIST = this.config.VERSION_LIST.concat(VERSION_LIST);
        this.middlewares = (0, _middlewares2.default)(this.config);

        this.app = new _koa2.default();
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
            if (!_path2.default.isAbsolute(VERSION_LIST[i])) {
                VERSION_LIST[i] = _path2.default.resolve(this.SERVER_ROOT, VERSION_LIST[i]);
            }
        }
        VERSION_LIST = (0, _uniq2.default)(VERSION_LIST);

        for (let i = 0; i < VERSION_LIST.length; i++) {
            let parsed = _path2.default.parse(VERSION_LIST[i]);
            VERSION_MAP[parsed.name] = require(VERSION_LIST[i]);
        }
        this.config.VERSION_MAP = VERSION_MAP;
        this.config.VERSION_LIST = VERSION_LIST;
    }

    loadMiddlewares() {
        const middlewareDebug = (0, _debug2.default)('zan:middleware');
        this.config.beforeLoadMiddlewares.call(this);
        for (let i = 0; i < this.middlewares.length; i++) {
            middlewareDebug(this.middlewares[i].name);
            this.app.use(this.middlewares[i].fn);
        }
        this.config.afterLoadMiddlewares.call(this);

        (this.config.ES7_ROUTER ? _router4.default : _router2.default)({
            app: this.app,
            path: this.config.ROUTERS_PATH
        });
        this.app.use((0, _router6.default)(this.config));

        let defaultErrorCallback = err => {
            console.log('<ERROR>');
            console.log(err);
        };

        this.app.on('error', this.config.ERROR_CALLBACK || defaultErrorCallback);

        this.app.listen(this.NODE_PORT, () => {
            if (this.NODE_ENV === 'development') {
                let msg = `
    Serving!

        - Zan框架版本：         ${_package2.default.version}
        - NODE_ENV:             ${this.NODE_ENV}
        - NODE_PORT:            ${this.NODE_PORT}
        - Local:                http://127.0.0.1:${this.NODE_PORT}
        - On Your Network:      http://${_ip2.default.address()}:${this.NODE_PORT}

            Copied local address to clipboard!`;
                console.log((0, _boxen2.default)(msg, {
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

exports.BusinessError = _BusinessError2.default;
exports.ParamsError = _ParamsError2.default;
exports.Validator = _Validator2.default;
exports.validator = new _Validator2.default();
exports.router = new _koaRouter2.default();
exports.Controller = _Controller2.default;
exports.Service = _Service2.default;

exports.default = Zan;