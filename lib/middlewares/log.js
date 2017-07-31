'use strict';

var _koaLog = require('koa-log4');

var _koaLog2 = _interopRequireDefault(_koaLog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_FORMAT = '":method :url HTTP/:http-version :status :response-timems" ":user-agent"';

_koaLog2.default.configure({
    appenders: [{
        type: 'console'
    }],
    replaceConsole: true
});

module.exports = function (options = {}) {
    const logger = _koaLog2.default.koaLogger(_koaLog2.default.getLogger('http'), {
        level: options.level || 'auto',
        format: options.format || DEFAULT_FORMAT
    });

    return logger;
};