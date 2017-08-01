'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function (config) {
    const CDN_PATH = config.CDN_PATH;
    const NODE_ENV = config.NODE_ENV;

    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            ctx.setState({
                loadScript: function (key, vendor = false, crossorigin = false, ifAsync = false) {
                    const keys = key.split('.');
                    const realKey = vendor ? key : keys.length > 1 ? keys[1] : keys[0];
                    const VERSION_MAP = ctx.app.config.VERSION_MAP;
                    const realVersionJs = keys.length > 1 ? VERSION_MAP[keys[0]] : VERSION_MAP['version_js'];
                    const src = NODE_ENV === 'development' && !vendor ? `/${realKey}.js` : vendor ? `${CDN_PATH}/${realKey}` : `${CDN_PATH}/${realVersionJs[realKey]}`;
                    let scriptStr = `<script src="${src}" charset="utf-8"`;
                    scriptStr += ifAsync ? ' async ' : '';
                    scriptStr += crossorigin ? ' crossorigin="anonymous" ' : '';
                    scriptStr += '></script>';

                    return scriptStr;
                },
                loadStyle: function (key, vendor = false, media = 'screen') {
                    const keys = key.split('.');
                    const realKey = vendor ? key : keys.length > 1 ? keys[1] : keys[0];
                    const VERSION_MAP = ctx.app.config.VERSION_MAP;
                    const realVersionCss = (keys.length > 1 ? VERSION_MAP[keys[0]] : VERSION_MAP['version_css']) || {};
                    const src = NODE_ENV === 'development' && !vendor ? `/${realKey}.css` : vendor ? `${CDN_PATH}/${realKey}` : `${CDN_PATH}/${realVersionCss[realKey]}`;
                    const linkStr = `<link rel="stylesheet" href="${src}" media="${media}">`;

                    return linkStr;
                }
            });
            yield next();
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })();
};