'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function () {
    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            if (ctx.path === '/_HB_') {
                if (ctx.query.service === 'online') {
                    ctx.status = 200;
                    ctx.body = {
                        result: true,
                        code: 200,
                        message: null,
                        data: 'ok'
                    };
                } else if (ctx.query.service === 'offline') {
                    ctx.status = 404;
                    ctx.body = {
                        result: true,
                        code: 404,
                        message: null,
                        data: 'ok'
                    };
                } else {
                    ctx.status = 200;
                    ctx.body = {
                        result: true,
                        code: 200,
                        message: null,
                        data: 'ok'
                    };
                }
            } else {
                yield next();
            }
        });

        function health(_x, _x2) {
            return _ref.apply(this, arguments);
        }

        return health;
    })();
};