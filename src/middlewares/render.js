import swigRender from 'koa-swig';
import co from 'co';
import UA from './ua';

module.exports = function (config) {
    config = config || {};

    const renderWrap = co.wrap(swigRender({
        root: config.viewPath,
        ext: 'html',
        cache: 'memory'
    }));

    const render = function (view, data) {
        let viewPath = view;
        data = data || {};
        if (typeof view === 'object') {
            viewPath = view.view;
            if (UA.isMobile(this.headers['user-agent'])) {
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

    return async(ctx, next) => {
        ctx.render = render.bind(ctx);
        await next();
    };
};
