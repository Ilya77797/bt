var session=require('../models/session');
exports.post = async function(ctx, next) {
  ctx.logout();
  var ses=ctx.sessionId;
  await session.remove({sid:`koa:sess:${ses}`});
  console.log(`--- ${new Date(Date.now()+10800000).toISOString().replace(/T/, ' ').replace(/\..+/, '')}--- session  removed: Sid${ses} `);

    ctx.session = null; // destroy session (!!!)
    ctx.sessionId=null;
    ctx.ses=null;

  if(ctx.request.ctx.params.f==':main')
    ctx.redirect('/');
  else
      ctx.redirect('/corzina');
};
