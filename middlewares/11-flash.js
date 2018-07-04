
module.exports = async function(ctx, next) {


  let messages = ctx.session.messages || {};

  // clear all flash
  delete ctx.session.messages;

  ctx.flash = function(type, html) {

    if (type === undefined) {
      return messages || {};
    }
    if (html === undefined) {
      return messages[type] || [];
    }

    if (!ctx.session.messages) {
      ctx.session.messages = {};
    }

    if (!ctx.session.messages[type]) {
      ctx.session.messages[type] = [];
    }

    ctx.session.messages[type].push(html);
  };

  await next();


  if (!ctx.session) return;

  if (ctx.status == 302 && !ctx.session.messages) {

    ctx.session.messages = messages;
  }

};
