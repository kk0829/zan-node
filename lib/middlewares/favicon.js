'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const resolve = require('path').resolve;
const fs = require('fs');

module.exports = function (path, options) {
    if (!path) {
        return (ctx, next) => {
            return next();
        };
    }

    path = resolve(path);
    options = options || {};

    let icon;
    const maxAge = options.maxAge == null ? 86400000 : Math.min(Math.max(0, options.maxAge), 31556926000);
    const cacheControl = `public, max-age=${maxAge / 1000 | 0}`;

    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            if (!/favicon.ico/.test(ctx.path)) {
                return next();
            }

            if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
                ctx.status = ctx.method === 'OPTIONS' ? 200 : 405;
                ctx.set('Allow', 'GET, HEAD, OPTIONS');
            } else {
                // lazily read the icon
                if (!icon) icon = fs.readFileSync(path);
                ctx.set('Cache-Control', cacheControl);
                ctx.type = 'image/x-icon';
                ctx.body = icon;
            }
        });

        function favicon(_x, _x2) {
            return _ref.apply(this, arguments);
        }

        return favicon;
    })();
};