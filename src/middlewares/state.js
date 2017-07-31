module.exports = async (ctx, next) => {
    ctx.state = ctx.state || {};
    ctx.state.global = ctx.state.global || {};
    ctx.hasState = key => ctx.state.hasOwnProperty(key);
    ctx.getState = key => {
        return key ? ctx.state[key] : ctx.state;
    };
    ctx.setState = (key, value) => {
        if (value) {
            ctx.state[key] = value;
        } else {
            Object.keys(key).forEach((item) => {
                ctx.state[item] = key[item];
            });
        }
    };
    ctx.setGlobal = (key, value) => {
        ctx.state.global[key] = value;
    };
    ctx.getGlobal = (key) => {
        return key ? ctx.state.global[key] : ctx.state.global;
    };
    await next();
};

