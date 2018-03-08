const union = require('lodash/union');
const defaultsDeep = require('lodash/defaultsDeep');
const isPlainObject = require('lodash/isPlainObject');
const querystring = require('querystring');
const mapKeysToSnakeCase = require('zan-utils/string/mapKeysToSnakeCase');
const mapKeysToCamelCase = require('zan-utils/string/mapKeysToCamelCase');

function transformData(key, value, toSnakeCase) {
  const plainObject = isPlainObject(key);
  let data = {};
  if (plainObject) {
    data = key;
  } else {
    data[key] = value;
  }
  toSnakeCase = (plainObject ? value : toSnakeCase) || false;
  if (toSnakeCase) {
    data = mapKeysToSnakeCase(data);
  }
  return data;
}

module.exports = {

  get acceptJSON() {
    if (this.path.endsWith('.json')) {
      return true
    } else {
      return false;
    }
  },

  hasState(key) {
    return key ? this.state.hasOwnProperty(key) : false;
  },

  /**
   * @method getState
   * @param  {String/null} key
   * @param  {Boolean} toCamelCase 是否转成驼峰格式
   */
  getState(key, toCamelCase = false) {
    let data = key ? this.state[key] : this.state;
    return toCamelCase ? mapKeysToCamelCase(data) : data;
  },

  setState(key, value, toSnakeCase = false) {
    const data = transformData(key, value, toSnakeCase);
    this.state = Object.assign(this.state || {}, data);
  },

  setEnv(key, value, toSnakeCase = false) {
    const data = transformData(key, value, toSnakeCase);
    this.state = Object.assign(this.state || {}, data);
    this.state.global = Object.assign(this.state.global || {}, data);
  },

  setGlobal(key, value, toSnakeCase = false) {
    const data = transformData(key, value, toSnakeCase);
    this.state.global = Object.assign(this.state.global || {}, data);
  },

  getGlobal(key, toCamelCase = false) {
    let data = key ? this.state.global[key] : this.state.global;
    return toCamelCase ? mapKeysToCamelCase(data) : data;
  },

  // 如果查询参数和请求体参数都有这个字段，则请求体中的参数优先级更高
  getRequestData(key) {
    const data = defaultsDeep({}, this.request.body, this.query);
    return key ? data[key] : data;
  },

  getPostData(key) {
    const data = this.request.body;
    return key ? data[key] : data;
  },

  pushBeforeRender(fn) {
    if (typeof fn === 'function') this.beforeRenderFns.push(fn);
  },

  getConfig(name) {
    if (!name) {
      return this.app.projectConfig;
    }
    let arr = name.split('.');
    let result = this.app.projectConfig;
    let i = 0;
    while (arr[i]) {
      result = result[arr[i]];
      i++;
    }
    return result;
  },

  getQueryData(key) {
    const str = this.querystring;
    let parsed = querystring.parse(str);
    Object.keys(parsed).forEach((item) => {
      if (Array.isArray(parsed[item]) && union(parsed[item]).length === 1) {
        parsed[item] = parsed[item][0];
      }
    });
    return key ? parsed[key] : parsed;
  },

  getRawCookies() {
    return this.headers.cookie;
  },

  getCookies() {
    let result = {};
    let cookies = this.headers.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      let arr = cookies[i].split('=');
      result[arr[0]] = arr[1];
    }
    return result;
  },

  getCookie(name, options) {
    return this.cookies.get(name, options);
  },

  setCookie(name, value, options) {
    return this.cookies.set(name, value, options);
  },

  throwBusinessError(type, code, msg) {
    this.businessErrorType = type;
    this.businessErrorContent = {
      code,
      msg
    };
  },

  json(status, data, extra) {
    if (extra) { // 三个参数情况，这3个参数分别为 code msg data
      this.body = {
        code: status,
        msg: data,
        data: extra
      };
    } else {
      this.body = {
        code: status.code,
        msg: status.msg,
        data
      };
    }
    return;
  },

  r(code, msg, data) {
    this.body = {
      code,
      msg,
      data: mapKeysToSnakeCase(data)
    };
    return;
  },

  getSession(key) {
    return key ? this.sessionCache[key] : this.sessionCache;
  },

  setSession(key, value) {
    let plainObject = isPlainObject(key);
    let data = {};
    if (plainObject) {
      data = key;
    } else {
      data[key] = value;
    }
    this.sessionCache = Object.assign(this.sessionCache || {}, data);
  },

  delSession(key) {
    delete this.sessionCache[key];
  },

  getCache(key) {
    return this.cache && this.cache[key];
  },

  setCache(key, value) {
    this.cache = this.cache || {};
    this.cache[key] = value;
    return this.cache[key];
  }

};