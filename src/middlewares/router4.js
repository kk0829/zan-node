const fs = require('fs');
const glob = require('glob');
const debug = require('debug')('zan:router');
const router = require('../lib/router');

module.exports = function(config) {
    if (!fs.existsSync(config.ROUTERS_PATH)) {
        return;
    }
    let files = glob.sync(`${config.ROUTERS_PATH}/**/*.js`);
    debug(files);
    for (let i = 0; i < files.length; i++) {
        let r = require(files[i]);
        if (Object.prototype.toString.call(r) === '[object Function]') {
            r(config.app, router);
        }
    }

    config.app.use(router.routes());
    config.app.use(router.allowedMethods());
};