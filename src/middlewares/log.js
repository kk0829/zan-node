const log4js = require('koa-log4');

const DEFAULT_FORMAT = '":method :url HTTP/:http-version :status :response-timems" ":user-agent"';

log4js.configure({
    appenders: [{
        type: 'console'
    }],
    replaceConsole: true
});

module.exports = function(options = {}) {
    const logger = log4js.koaLogger(log4js.getLogger('http'), {
        level: options.level || 'auto',
        format: options.format || DEFAULT_FORMAT
    });

    return logger;
};