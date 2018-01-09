'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { parseRequest } = require('../lib/util');

module.exports = (() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
        ctx.requestDesc = parseRequest(ctx);
        ctx.finalPath = ctx.requestDesc.finalPath;
        ctx.beforeRenderFns = ctx.beforeRenderFns || [];
        ctx.state = ctx.state || {};
        ctx.state.global = ctx.state.global || {};
        ctx.sessionCache = ctx.sessionCache || {};

        yield next();
    });

    function mixin(_x, _x2) {
        return _ref.apply(this, arguments);
    }

    return mixin;
})();