const Router = require('koa-router');
const fs = require('fs');
const glob = require('glob');
const debug = require('debug')('zan:router');
const router = new Router();

module.exports = function (config) {
    if (!fs.existsSync(config.ROUTERS_PATH)) {
        return;
    }
    let files = glob.sync(`${config.ROUTERS_PATH}/**/*.js`);
    debug(files);
    for (let i = 0; i < files.length; i++) {
        let r = require(files[i]);
        router.use('', r.routes(), r.allowedMethods());
    }

    config.app.use(router.routes());
    config.app.use(router.allowedMethods());
};