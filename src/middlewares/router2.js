import fs from 'fs';
import path from 'path';
import convert from 'koa-convert';
import Router from 'koa-router';

export default function({ app, path: routePath }) {
    const cwd           = process.cwd();
    const ENV           = process.env.NODE_ENV;
    const prodPath      = ENV === 'production' ? 'server_dist' : 'server';
    const router        = new Router();
    const noop          = () => {};
    const routerConfig  = {};
    const controllers   = {};

    const controllerDirPath = path.join(cwd, prodPath, '/controllers');
    const routerPath = path.join(routePath);
    const routerConfigPath  = path.join(cwd, prodPath, '/routes/router.config');

    // get all controller class
    fs.readdirSync(controllerDirPath).forEach((file) => {
        if (/\.js$/.test(file)) {
            const name = file.replace('.js', '');
            controllers[name] = require(path.join(controllerDirPath, file)).default;
        }
    });

    // get all json file route config
    let defaultRouter = {}
    fs.readdirSync(routerPath).forEach((file) => {
        if (/\.json$/.test(file)) {
            defaultRouter = Object.assign(
                defaultRouter,
                JSON.parse(fs.readFileSync(path.join(routerPath, file)) || '{}')
            );
        }
    });

    /*
     * key is Controller name, value is a array with object
     * {
     *   method: 'get|post|all|delete|patch|put',
     *   url
     * }
     */

    const addRouterConfig = (item) => {
        const { method } = item;
        if (!routerConfig[method]) {
            routerConfig[method] = [];
        }
        routerConfig[method].push(item);
    };

    const formatRouter = item => `[${item.method.toUpperCase()}] ${item.url} => ${item.ctrlName}.${item.fnName}`;

    // deal with defaultRouter
    const defaultRouterConfig = {};
    Object.keys(defaultRouter).forEach((key) => {
        const [method, url] = key.split(' ');
        const [ctrlName, fnName] = defaultRouter[key].split('.');
        if (!defaultRouterConfig[ctrlName]) defaultRouterConfig[ctrlName] = [];
        defaultRouterConfig[ctrlName].push({
            method,
            url,
            fnName,
        });
    });

    Object.keys(controllers).forEach((ctrlName) => {
        const controller = new controllers[ctrlName]();
        const $routes = controller.$routes;

        // load default route config first
        (defaultRouterConfig[ctrlName] || []).forEach((item) => {
            addRouterConfig(Object.assign(item, { ctrlName }));
            router[item.method](item.url, controller[item.fnName]);
        });

        ($routes || []).forEach((item) => {
            addRouterConfig(Object.assign(item, { ctrlName }));
            router[item.method](item.url, ...item.middleware, controller[item.fnName]);
        });
    });

    // write config into file
    const PRE_COMMENT = '# This file is auto generated when server is started.\n';
    const result = Object
        .keys(routerConfig)
        .sort((a, b) => a.length - b.length)
        .map(key => routerConfig[key]
            .map(item => formatRouter(item))
            .sort((a, b) => a.length - b.length))
        .reduce((prev, next) => prev.concat(next), []);

    result.unshift(PRE_COMMENT);

    fs.writeFile(routerConfigPath, result.join('\n'), noop);

    app.use(convert(router.routes()));
    app.use(convert(router.allowedMethods()));
};

