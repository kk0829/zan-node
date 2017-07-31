'use strict';

const parser = require('ua-parser-js');

const UA = {

    isIOS(userAgent) {
        let parsed = parser(userAgent);
        return parsed.os.name === 'iOS';
    },

    getIOSVersion(userAgent) {
        let parsed = parser(userAgent);
        return this.isIOS(userAgent) ? parsed.os.version : '';
    },

    isAndroid(userAgent) {
        let parsed = parser(userAgent);
        return parsed.os.name === 'Android';
    },

    getAndroidVersion(userAgent) {
        let parsed = parser(userAgent);
        return this.isAndroid(userAgent) ? parsed.os.version : '';
    },

    isWeixin(userAgent) {
        return (/MicroMessenger/i.test(userAgent)
        );
    },

    isQQ(userAgent) {
        return (/QQ/i.test(userAgent)
        );
    },

    isIPad(userAgent) {
        let parsed = parser(userAgent);
        return parsed.device.model === 'iPad';
    },

    isMobile(userAgent) {
        let parsed = parser(userAgent);
        return parsed.device.type === 'mobile' || parsed.device.model === 'iPhone' || parsed.os.name === 'Android' || /iphone/i.test(userAgent);
    },

    isSafari(userAgent) {
        let parsed = parser(userAgent);
        return parsed.browser.name === 'Safari';
    },

    getSafariVersion(userAgent) {
        let parsed = parser(userAgent);
        if (this.isSafari(userAgent)) {
            return parsed.browser.major;
        }
        return '';
    },

    getFullSafariVersion(userAgent) {
        let parsed = parser(userAgent);
        if (this.isSafari(userAgent)) {
            return parsed.browser.version;
        }
        return '';
    },

    isChrome(userAgent) {
        let parsed = parser(userAgent);
        return parsed.browser.name === 'Chrome';
    },

    getChromeVersion(userAgent) {
        let parsed = parser(userAgent);
        if (this.isChrome(userAgent)) {
            return parsed.browser.major;
        }
        return '';
    },

    getFullChromeVersion(userAgent) {
        let parsed = parser(userAgent);
        if (this.isChrome(userAgent)) {
            return parsed.browser.version;
        }
        return '';
    },

    isUC(userAgent) {},

    getUCVersion(userAgent) {},

    isWxd(userAgent) {},

    isWsc(userAgent) {
        return (/youzan_wsc_|wsc/.test(userAgent)
        );
    }

};

module.exports = UA;