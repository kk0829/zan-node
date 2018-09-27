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

module.exports = async (ctx, next) => {
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
        await fs.writeFileSync(filePath, "offline");
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
    await next();
  }
};
