
const fs = require('fs');
const md5File = require('md5-file');

const Info=require('./models/info');
//require('./fixtures/Logger')();
var  createAll=require('./fixtures/create_all');
function pathToJson() {
    return __dirname+'/Price/last.json';
}

//Эта функция следит за изменениями в last.json. Если изменения были, происходит обновление бд.
//Путь к файлу с выгрузкой(last.json)
var root=pathToJson();
require('./libs/watchFileChange')(root, fs, md5File, Info, createAll);