"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = (() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
        ctx.json = function (status, data) {
            ctx.body = {
                code: status.code,
                msg: status.msg,
                data
            };
            return;
        };
        yield next();
    });

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();