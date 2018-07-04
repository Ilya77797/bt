const config = require('./config/default');
const server = require('./server');

server.listen(config.port);

