'use strict';

const debug = require('debug')('zan:rewrite');
const toRegexp = require('path-to-regexp');

/**
 * Turn params array into a map for quick lookup.
 *
 * @param {Array} params
 * @return {Object}
 * @api private
 */
function toMap(params) {
    const map = {};

    params.forEach((param, i) => {
        param.index = i;
        map[param.name] = param;
    });

    return map;
}

/**
 * Rwrite `src` to `dest`.
 *
 * @param {String|RegExp} src
 * @param {String} dest
 * @return {Function}
 * @api public
 */
function rewrite(items) {
    let arr = [];
    for (let i = 0; i < items.length; i++) {
        const keys = [];
        const re = toRegexp(items[i][0], keys);
        const map = toMap(keys);
        arr.push({
            keys,
            re,
            map,
            dest: items[i][1]
        });
        debug('rewrite %s -> %s    %s', items[i][0], items[i][1], re);
    }

    return function (ctx, next) {
        const orig = ctx.url;

        for (let i = 0; i < arr.length; i++) {
            const m = arr[i].re.exec(orig);
            const map = arr[i].map;
            const dest = arr[i].dest;
            if (m) {
                ctx.url = dest.replace(/\$(\d+)|(?::(\w+))/g, (_, n, name) => {
                    if (name) return m[map[name].index + 1];
                    return m[n];
                });
                debug('rewrite %s -> %s', orig, ctx.url);
                return next().then(() => {
                    ctx.url = orig;
                });
                break;
            }
        }

        return next();
    };
}

module.exports = rewrite;