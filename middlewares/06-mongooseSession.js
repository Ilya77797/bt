const session = require('koa-generic-session');
const mongooseStore = require('../libs/mongoose-sess');
const convert = require('koa-convert');
const mongoose=require('../libs/mongoose');

module.exports = session({
  key:     'sid',
  cookie:  {
    httpOnly:  true,
    path:      '/',
    overwrite: true,
    signed:    false,
    maxAge:    3600 * 4 * 1e3 // session expires in 4 hours, remember me lives longer
  },



  rolling: true,

  store: mongooseStore.create({
    model:   'Session',
    collection:   'sessions',
    connection: mongoose,
    expires: 3600 * 4
  })
});
