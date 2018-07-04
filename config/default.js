const defer = require('config/defer').deferConfig;
const path = require('path');

module.exports = {

  secret:   'mysecret',
  mongoose: {
    uri:  'mongodb://localhost:27017/app'   ,
    options: {
      server: {
        socketOptions: {
          keepAlive: 1
        },
        poolSize:      5

      }
    }
  },
  crypto: {
    hash: {
      length:     128,
      iterations: 12000
    }
  },
  template: {
    // template.root uses config.root
    root: defer(function(cfg) {
      return path.join(cfg.root, 'templates');
    })
  },
  root:     process.cwd(),
  port: 8080,
  emailFrom:'bteam2017@yandex.ru',
  emailPassword:'bt2017eamItog_1',
  emailTo:' office@bteam.ru',
    emailTo2:'info@bteam.ru ',
    isPending:false,
    dir:''
};


//'mongodb://Ilya:bt2017eamItog_1@cluster0-shard-00-00-a7qcq.mongodb.net:27017,cluster0-shard-00-01-a7qcq.mongodb.net:27017,cluster0-shard-00-02-a7qcq.mongodb.net:27017/app?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
