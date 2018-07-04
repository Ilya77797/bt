require('../models/categor');
var session=require('../libs/mongoose');
const passport = require('koa-passport');
const mongoose=require('../libs/mongoose');
const Info=require('../models/info');
var Categor=require('../models/categor');
var Data=require('../models/data');
var isLogged=require('../libs/isLogged');
var getUser=require('../libs/getUser');
const LIMIT=9;
exports.get=async function(ctx, next) {


        try{
            var INFO=await Info.find({_id:0});
            var updateTime=Math.round((Date.now()-INFO[0].time)/60000);
        }
        catch(e){

        }

        if(await isLogged(ctx)){
            var user= await getUser(ctx);
            if(user==null)
                ctx.body = ctx.render('main',{isLoged:false, time:updateTime});
            else
                ctx.body = ctx.render('main',{isLoged:true, name:getFIO(user.name), time:updateTime});

        }
        else {

            ctx.body = ctx.render('main',{isLoged:false, time:updateTime});
        }

};

function getFIO(str) {
    var size=str.split(' ').length;
    switch(size){
        case 0:
            return ''
        case 3:
            return getFIOshort(str)
        default:
            return str;
    }
}

function getFIOshort(str) {
    var mass=str.split(' ');
    return mass[0]+' '+mass[1][0]+'. '+mass[2][0]+'.';
}





