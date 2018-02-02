'use strict';

const lodash = require('lodash');
const validator = require('validator');
const { ParamsError } = require('./Error');

const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);
const keys = Reflect.ownKeys;

if (!Object.values) {
    Object.values = function values(O) {
        return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
    };
}

class Validator {

    // contains(str, seed) - check if the string contains the seed.
    contains(str = '', seed, msg = '', code = 12345) {
        if (!validator.contains(str, seed)) {
            msg = `字符串${str}中不包含字符串${seed}`;
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // equals(str, comparison) - check if the string matches the comparison.
    equals(str = '', comparison, msg = 'equals: 参数校验失败', code = 12345) {
        if (!validator.equals(str, comparison)) {
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // isAfter(str [, date]) - check if the string is a date that's after the specified date (defaults to now).
    isAfter(str = '', date, msg = '日期校验失败', code = 12345) {
        if (!validator.isAfter(str, date)) {
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // isBefore(str [, date]) - check if the string is a date that's before the specified date.
    isBefore(str = '', date, msg = '日期校验失败', code = 12345) {
        if (!validator.isBefore(str, date)) {
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // isBoolean(str) - check if a string is a boolean.
    isBoolean(str = '', msg = 'isBoolean: 参数校验失败', code = 12345) {
        if (!validator.isBoolean(str)) {
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // isCreditCard(str) - check if the string is a credit card.
    isCreditCard(str = '', msg = 'isCreditCard: 参数校验失败', code = 12345) {
        if (!validator.isCreditCard(str)) {
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // check if the string is an email.
    required(data, msg = '参数不能为空', code = 12345) {
        if (lodash.isNumber(data)) {
            return this;
        }
        if (lodash.isString(data)) {
            data = data.trim();
        }
        if (!data || data === 'null' || data === 'undefined') {
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // check if the string is an email. 
    isEmail(str = '', msg = '邮箱地址不合法', code = 12345) {
        if (!validator.isEmail(str)) {
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // isNumeric(str) - check if the string contains only numbers.
    isNumeric(str = '', msg = '包含非数字', code = 12345) {
        if (!validator.isNumeric(str)) {
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // isURL(str [, options]) - check if the string is an URL. options is an object which defaults to 
    /*
        {
            protocols: ['http', 'https', 'ftp'],
            require_tld: true,
            require_protocol: false,
            require_host: true,
            require_valid_protocol: true,
            allow_underscores: false,
            host_whitelist: false,
            host_blacklist: false,
            allow_trailing_dot: false,
            allow_protocol_relative_urls: false
        }
     */
    isURL(str = '', options = {}, msg = '地址不合法', code = 12345) {
        if (!validator.isURL(str, options)) {
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // isEmpty(str) - check if the string has a length of zero.
    isEmpty(str = '', msg = '字符串不为空', code = 12345) {
        if (!validator.isEmpty(str)) {
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // isIP(str [, version]) - check if the string is an IP (version 4 or 6).
    isIP(str = '', version, msg = 'IP 参数校验失败', code = 12345) {
        if (!validator.isIP(str)) {
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // check if the string is valid JSON (note: uses JSON.parse).
    isJSON(str = '', msg = 'JSON 字符串参数校验失败', code = 12345) {
        if (!validator.isJSON(str)) {
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // check if the string's length falls in a range. options is an object which defaults to {min:0, max: undefined}. Note: this function takes into account surrogate pairs.
    isLength(str = '', options, msg = '字符串长度校验失败', code = 12345) {
        if (!validator.isLength(str, options)) {
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // isUUID(str [, version]) - check if the string is a UUID (version 3, 4 or 5).
    isUUID(str = '', version, msg = '校验失败，非 UUID 字符串', code = 12345) {
        if (!validator.isUUID(str, version)) {
            throw new ParamsError(code, msg);
        }
        return this;
    }

    // isMobilePhone(str, locale) - check if the string is a mobile phone number, (locale is one of 
    // ['ar-DZ', 'ar-SA', 'ar-SY', 'cs-CZ', 'de-DE', 'da-DK', 'el-GR', 'en-AU', 'en-CA', 'en-GB', 'en-HK', 
    // 'en-IN', 'en-KE', 'en-NG', 'en-NZ', 'en-RW', 'en-UG', 'en-US', 'en-TZ', 'en-ZA', 'en-ZM', 'es-ES', 
    // 'en-PK', 'fa-IR', 'fi-FI', 'fr-FR', 'he-IL', 'hu-HU', 'it-IT', 'ja-JP', 'ko-KR', 'lt-LT', 'ms-MY', 
    // 'nb-NO', 'nn-NO', 'pl-PL', 'pt-PT', 'ro-RO', 'ru-RU', 'sr-RS', 'tr-TR', 'vi-VN', 'zh-CN', 'zh-HK', 'zh-TW'] 
    // OR 'any'. If 'any' is used, function will check if any of the locales match).
    isMobilePhone(str = '', locale = 'zh-CN', msg = '校验失败，非手机号', code = 12345) {
        if (!validator.isMobilePhone(str, locale)) {
            throw new ParamsError(code, msg);
        }
        return this;
    }
}

module.exports = Validator;