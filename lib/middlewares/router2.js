'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function ({ app, path: routePath }) {
    const cwd = process.cwd();
    const ENV = process.env.NODE_ENV;
    const prodPath = ENV === 'production' ? 'server_dist' : 'server';
    const router = new _koaRouter2.default();
    const noop = () => {};
    const routerConfig = {};
    const controllers = {};

    const controllerDirPath = _path2.default.join(cwd, prodPath, '/controllers');
    const routerPath = _path2.default.join(routePath);
    const routerConfigPath = _path2.default.join(cwd, prodPath, '/routes/router.config');

    // get all controller class
    _fs2.default.readdirSync(controllerDirPath).forEach(file => {
        if (/\.js$/.test(file)) {
            const name = file.replace('.js', '');
            controllers[name] = require(_path2.default.join(controllerDirPath, file)).default;
        }
    });

    // get all json file route config
    let defaultRouter = {};
    _fs2.default.readdirSync(routerPath).forEach(file => {
        if (/\.json$/.test(file)) {
            defaultRouter = Object.assign(defaultRouter, JSON.parse(_fs2.default.readFileSync(_path2.default.join(routerPath, file)) || '{}'));
        }
    });

    /*
     * key is Controller name, value is a array with object
     * {
     *   method: 'get|post|all|delete|patch|put',
     *   url
     * }
     */

    const addRouterConfig = item => {
        const { method } = item;
        if (!routerConfig[method]) {
            routerConfig[method] = [];
        }
        routerConfig[method].push(item);
    };

    const formatRouter = item => `[${item.method.toUpperCase()}] ${item.url} => ${item.ctrlName}.${item.fnName}`;

    // deal with defaultRouter
    const defaultRouterConfig = {};
    Object.keys(defaultRouter).forEach(key => {
        const [method, url] = key.split(' ');
        const [ctrlName, fnName] = defaultRouter[key].split('.');
        if (!defaultRouterConfig[ctrlName]) defaultRouterConfig[ctrlName] = [];
        defaultRouterConfig[ctrlName].push({
            method,
            url,
            fnName
        });
    });

    Object.keys(controllers).forEach(ctrlName => {
        const controller = new controllers[ctrlName]();
        const $routes = controller.$routes;

        // load default route config first
        (defaultRouterConfig[ctrlName] || []).forEach(item => {
            addRouterConfig(Object.assign(item, { ctrlName }));
            router[item.method](item.url, controller[item.fnName]);
        });

        ($routes || []).forEach(item => {
            addRouterConfig(Object.assign(item, { ctrlName }));
            router[item.method](item.url, ...item.middleware, controller[item.fnName]);
        });
    });

    // write config into file
    const PRE_COMMENT = '# This file is auto generated when server is started.\n';
    const result = Object.keys(routerConfig).sort((a, b) => a.length - b.length).map(key => routerConfig[key].map(item => formatRouter(item)).sort((a, b) => a.length - b.length)).reduce((prev, next) => prev.concat(next), []);

    result.unshift(PRE_COMMENT);

    _fs2.default.writeFile(routerConfigPath, result.join('\n'), noop);

    app.use((0, _koaConvert2.default)(router.routes()));
    app.use((0, _koaConvert2.default)(router.allowedMethods()));
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;