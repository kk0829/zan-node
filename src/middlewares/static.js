import koaStatic from 'koa-static';

/**
 * @param  {String} root root directory string. nothing above this root directory can be served
 * @param  {Object} opts options object.
 *
 * @param {Number} opts.maxage Browser cache max-age in milliseconds. defaults to 0
 * @param {Boolean} opts.hidden Allow transfer of hidden files. defaults to false
 * @param {String} opts.index Default file name, defaults to 'index.html'
 * @param {Boolean} opts.defer If true, serves after return next(), allowing any downstream middleware to respond first.
 * @param {Boolean} opts.gzip Try to serve the gzipped version of a file automatically when gzip is supported by a client and if the requested file with .gz extension exists. defaults to true.
 */
module.exports = function (root, opts) {
    opts = opts || {};
    return koaStatic(root, opts);
};
