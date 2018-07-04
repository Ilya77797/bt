//Разрешить отдавать пользовотелю лишь файлы, находящиеся в папке Public
const serve = require('koa-static');
module.exports = serve('public');

