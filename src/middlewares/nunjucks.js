import nunjucks from 'nunjucks';

module.exports = function(config) {
    let env = nunjucks.configure(config.VIEW_PATH, {
        autoescape: true
    });
    const loadCss = function(key, vendor = false, media = 'screen') {
    	const keys = key.split('.');
    	const realKey = vendor ? key : keys.length > 1 ? keys[1] : keys[0];
    	const VERSION_MAP = config.VERSION_MAP;
    	const realVersionCss = (keys.length > 1 ? VERSION_MAP[keys[0]] : VERSION_MAP['version_css']) || {};
    	const src = (config.NODE_ENV === 'development' && !vendor)
    	    ? `/${realKey}.css`
    	    : (vendor ? `${config.CDN_PATH}/${realKey}` : `${config.CDN_PATH}/${realVersionCss[realKey]}`);
    	const linkStr = `<link rel="stylesheet" href="${src}" media="${media}">`;

    	return linkStr;
    };
    env.addGlobal('loadCss', loadCss);
    env.addGlobal('loadStyle', loadCss);

    return async(ctx, next) => {
        ctx.render = function(name, context = {}) {
            ctx.body = env.render(name, context);
        };
        await next();
    };
};