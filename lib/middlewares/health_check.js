"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require("fs");
const filePath = process.cwd() + "/.health";

fs.writeFileSync(filePath, "online");

function healthReturn(code, message = null) {
  this.status = code;
  this.body = {
    result: true,
    code,
    message,
    data: "ok"
  };
}

module.exports = (() => {
  var _ref = _asyncToGenerator(function* (ctx, next) {
    ctx.healthReturn = healthReturn;
    if (ctx.path === "/_HB_") {
      if (ctx.query.service === "online") {
        try {
          fs.writeFileSync(filePath, "online");
        } catch (e) {
          console.log(e);
        }
        ctx.healthReturn(200);
      } else if (ctx.query.service === "offline") {
        try {
          yield fs.writeFileSync(filePath, "offline");
        } catch (e) {
          console.log(e);
        }
        ctx.healthReturn(404);
      } else {
        try {
          let data = fs.readFileSync(filePath, {
            encoding: "utf8"
          });
          if (data === "offline") {
            ctx.healthReturn(404);
          } else {
            ctx.healthReturn(200);
          }
        } catch (e) {
          console.log(e);
          ctx.healthReturn(404);
        }
      }
    } else {
      yield next();
    }
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();