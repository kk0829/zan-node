const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

const NODE_ENV = process.env.NODE_ENV;

let BASE_PATH = NODE_ENV === 'development' ?
    path.resolve(process.cwd(), 'server') :
    path.resolve(process.cwd(), 'server_dist');

let VIEW_PATH = [];
if (fs.existsSync(path.resolve(BASE_PATH, 'views'))) {
    VIEW_PATH.push(path.resolve(BASE_PATH, 'views'));
}
if (fs.existsSync(path.resolve(BASE_PATH, 'src'))) {
    VIEW_PATH.push(path.resolve(BASE_PATH, 'src'));
}

/**
 * autoescape (默认值: true) 控制输出是否被转义，查看 Autoescaping
 * throwOnUndefined (default: false) 当输出为 null 或 undefined 会抛出异常
 * trimBlocks (default: false) 自动去除 block/tag 后面的换行符
 * lstripBlocks (default: false) 自动去除 block/tag 签名的空格
 * watch (默认值: false) 当模板变化时重新加载。使用前请确保已安装可选依赖 chokidar。
 * noCache (default: false) 不使用缓存，每次都重新编译
 * web 浏览器模块的配置项
 * 	useCache (default: false) 是否使用缓存，否则会重新请求下载模板
 * 	async (default: false) 是否使用 ajax 异步下载模板
 * express 传入 express 实例初始化模板设置
 * tags: (默认值: see nunjucks syntax) 定义模板语法，查看 Customizing Syntax
 */
let env = nunjucks.configure(VIEW_PATH, {
    autoescape: true,
    throwOnUndefined: !(NODE_ENV === 'production' || NODE_ENV === 'prod'),
    noCache: false
});

module.exports = env;