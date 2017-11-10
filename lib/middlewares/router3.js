'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');
const debug = require('debug');
const glob = require('glob');
const isPlainObject = require('lodash/isPlainObject');
const isFunction = require('lodash/isFunction');
const { parseRequest } = require('../lib/util');

const routerDebug = debug('zan:router');

function getAllControllers(basePath) {
    let controllers = {};
    let files = glob.sync(`${basePath}/**/*.js`);
    files = files.filter(item => {
        return item.indexOf('controllers') > -1;
    });
    for (let i = 0; i < files.length; i++) {
        let requireContent = require(files[i]);
        let key = files[i].split('src/')[1].replace('/controllers', '');

        if (isFunction(requireContent)) {
            controllers[key] = {
                controller: new requireContent()
            };
        } else if (isPlainObject(requireContent) && requireContent.default) {
            if (isFunction(requireContent.default)) {
                controllers[key] = {
                    controller: new requireContent.default()
                };
            } else {
                controllers[key] = {
                    controller: requireContent.default
                };
            }
        } else {
            controllers[key] = {
                controller: requireContent
            };
        }
    }
    return controllers;
};

module.exports = config => {
    let controllers = getAllControllers(config.SRC_PATH);
    routerDebug(controllers);

    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            let requestDesc = parseRequest(ctx);

            routerDebug(requestDesc);
            if (controllers[requestDesc.file] && controllers[requestDesc.file].controller[requestDesc.funcName]) {
                yield controllers[requestDesc.file].controller[requestDesc.funcName](ctx, next);
            } else {
                yield next();
            }
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })();
};