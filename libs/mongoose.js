/**
 * This file must be required at least ONCE.
 * After it's done, one can use require('mongoose')
 *
 * In web-app: ctx is done at init phase
 * In tests: in mocha.opts
 * In gulpfile: in beginning
 */

const  MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const mongoose = require('mongoose');
const config = require('../config/default');
mongoose.Promise = Promise;

if (process.env.MONGOOSE_DEBUG) {
  mongoose.set('debug', true);
}

mongoose.connect(config.mongoose.uri, {useMongoClient:true} /*config.mongoose.options*/);
console.log('conected');
/*MongoClient.connect(config.mongoose.uri, function(err, db) {
    if(!err) {
        console.log("We are connected to db");
    }

   // db.close();
});*/

module.exports = mongoose;
