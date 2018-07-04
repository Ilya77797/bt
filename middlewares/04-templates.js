//Подготовка шаблонов
const pug = require('pug');
const config = require('config');
const path = require('path');

module.exports = async function(ctx, next) {

  /* default helpers */
  ctx.locals = {
    /* at the time of ctx middleware, user is unknown, so we make it a getter */
    get user() {
      return ctx.req.user; // passport sets ctx
    },

    get flash() {
      return ctx.flash();
    }
  };

  ctx.render = function(templatePath, locals) {
    locals = locals || {};
    // warning!
    // _.assign does NOT copy defineProperty
    // so I use ctx.locals as a root and merge all props in it, instead of cloning ctx.locals
    const localsFull = Object.create(ctx.locals);

    for(const key in locals) {
      localsFull[key] = locals[key];
    }
     // var f= config.template.root;
      var p=__dirname.replace('middlewares','templates');
    const templatePathResolved = path.join(p, templatePath + '.pug');


    return pug.renderFile(templatePathResolved, localsFull);
  };

  await next();

};
