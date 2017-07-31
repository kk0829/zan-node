'use strict';

var _koaSwig = require('koa-swig');

var _koaSwig2 = _interopRequireDefault(_koaSwig);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _ua = require('./ua');

var _ua2 = _interopRequireDefault(_ua);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function (config) {
    config = config || {};

    const renderWrap = _co2.default.wrap((0, _koaSwig2.default)({
        root: config.viewPath,
        ext: 'html',
        cache: 'memory'
    }));

    const render = function (view, data) {
        let viewPath = view;
        data = data || {};
        if (typeof view === 'object') {
            viewPath = view.view;
            if (_ua2.default.isMobile(this.headers['user-agent'])) {
                viewPath = `wap/${viewPath}`;
            } else {
                viewPath = `www/${viewPath}`;
            }
            delete view.view;
            data = view;
        }
        for (let item in config.extraConfig) {
            data[item] = config.extraConfig[item];
        }
        let globalState = this.getState && this.getState('global') || {};
        let globalWrap = Object.assign(data._global || {}, config.extraConfig, globalState);
        delete globalWrap.version_css;
        delete globalWrap.version_js;
        data._global = JSON.stringify(globalWrap);
        return renderWrap.call(this, viewPath, data);
    };

    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            ctx.render = render.bind(ctx);
            yield next();
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })();
};