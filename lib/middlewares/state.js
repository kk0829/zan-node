"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = (() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
        ctx.state = ctx.state || {};
        ctx.state.global = ctx.state.global || {};
        ctx.hasState = function (key) {
            return ctx.state.hasOwnProperty(key);
        };
        ctx.getState = function (key) {
            return key ? ctx.state[key] : ctx.state;
        };
        ctx.setState = function (key, value) {
            if (value) {
                ctx.state[key] = value;
            } else {
                Object.keys(key).forEach(function (item) {
                    ctx.state[item] = key[item];
                });
            }
        };
        ctx.setGlobal = function (key, value) {
            ctx.state.global[key] = value;
        };
        ctx.getGlobal = function (key) {
            return key ? ctx.state.global[key] : ctx.state.global;
        };
        yield next();
    });

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();