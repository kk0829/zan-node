const Router = require('koa-router');
const path = require('path');
const fs = require('fs');

const router = new Router();

let generateEntries = (srcPath, name, entries) => {
    name = name || '';
    entries = entries || [];

    let paths = fs.readdirSync(srcPath)
        .filter((file) => {
            return file.indexOf('.') !== 0 && file !== '_index.js' && file !== 'package.json';
        });

    for (let i = 0; i < paths.length; i++) {
        if (fs.statSync(path.join(srcPath, paths[i])).isDirectory()) {
            generateEntries(`${srcPath}/${paths[i]}`, `${name}/${paths[i]}`, entries);
        } else if (
            fs.statSync(path.join(srcPath, paths[i])).isFile() &&
            // filter js file
            paths[i].indexOf('.js') === paths[i].length - 3
        ) {
            entries.push([`${name}`, path.join(srcPath, `${paths[i]}`)]);
        }
    }
    return entries;
};

module.exports = function (config) {
    if (!fs.existsSync(config.path)) {
        return;
    }
    let entries = generateEntries(config.path);

    for (let i = 0; i < entries.length; i++) {
        let r = require(entries[i][1]);
        router.use(entries[i][0], r.routes(), r.allowedMethods());
    }

    config.app.use(router.routes());
    config.app.use(router.allowedMethods());
};