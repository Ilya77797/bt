

const busboy = require('co-busboy');
const convert = require('koa-convert');


module.exports = convert(function* (next) {

  if (!this.request.is('multipart/*')) {
    return yield* next;
  }

  const parser = busboy(this, {
    autoFields: true
  });

  let fileStream;

  while (fileStream = yield parser) {

    this.throw(400, "Files are not allowed here");
  }


  const body = this.request.body;

  for (let [name, val, fieldnameTruncated, valTruncated] of parser.fields) {
    if (body[name]) {
      if (!Array.isArray(body[name])) {
        body[name] = [body[name]];
      }
      body[name].push(val);
    } else {
      body[name] = val;
    }
  }

  yield* next;
});
