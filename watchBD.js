var mongoose=require('./libs/mongoose');
var session=require('./models/session');
let User = require('./models/user');
const fs = require('fs');
var log_file = fs.createWriteStream(__dirname + '/BDLogs/debug.log', {flags : 'a'});
async function watch() {
    //var a= await session.models.Session.find({});
    var a=await session.find({});
    var idArray=[];
    for(let i=0;i<a.length;i++){
        idArray.push(a[i].user);
    }
    var user=await User.find({ _id:{ "$in" : idArray}  });
    log_file.write('Слепок от '+new Date(Date.now()+10800000).toISOString().replace(/T/, ' ').replace(/\..+/, '')+'  '+`\n Сессии: \n ${printArray(a)} \n Пользователи: \n ${printArray(user)}` + '\n'+'-----------------'+'\n');
}

function printArray(array) {
    var str='';
    for(let i=0;i<array.length;i++){
        str+=`     N${i} \n ${array[i]} \n`
    }
    return str;
}

var k=setInterval(watch,1200000);
