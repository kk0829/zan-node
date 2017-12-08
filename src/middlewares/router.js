const fs = require('fs');
const glob = require('glob');
const debug = require('debug')('zan:router');
const router = require('../lib/router');

// name ${目录名}.${文件名}
// controllers
function getObject(name, controllers) {
    let arr = name.split('.');
    let result = controllers;
    let i = 0;
    while (arr[i]) {
        result = result[arr[i]];
        i++;
    }
    return result;
}

module.exports = function(config) {
    if (!fs.existsSync(config.ROUTERS_PATH)) {
        return;
    }
    let files = glob.sync(`${config.ROUTERS_PATH}/**/*.js`);
    debug(files);
    for (let i = 0; i < files.length; i++) {
        const requireContent = require(files[i]);
        const type = Object.prototype.toString.call(requireContent)

        if (requireContent.methods) { // 文件返回 router 示例
            router.use('', requireContent.routes(), requireContent.allowedMethods());
        } else if (type === '[object Function]') {
            requireContent(config.app, router);
        } else if (type === '[object Array]') {
            for (let j = 0; j < requireContent.length; j++) {
                const httpVerb = requireContent[j][0].toLowerCase(); // HTTP 请求方法
                const requestPath = requireContent[j][1]; // 请求路径
                const obj = getObject(requireContent[j][2], config.app.controllers);
                const method = requireContent[j][3]; // 调用对方
                debug(httpVerb, requestPath, obj, method);
                router[httpVerb](requestPath, obj[method].bind(obj));
            }
        }
    }

    config.app.use(router.routes());
    config.app.use(router.allowedMethods());
};