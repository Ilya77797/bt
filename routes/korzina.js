require('../models/categor');
var session=require('../libs/mongoose');
const passport = require('koa-passport');
const mongoose=require('../libs/mongoose');
const Info=require('../models/info');
var Categor=require('../models/categor');
var Data=require('../models/data');
var isLogged=require('../libs/isLogged');
const User=require('../models/user');
var getUser=require('../libs/getUser');
addProto();
exports.get=async function (ctx, next) {
    //var products=ctx.request.body.products;
    var INFO=await Info.find({_id:0});
    var updateTime=Math.round((Date.now()-INFO[0].time)/60000);
    if(await isLogged(ctx))
    {
        var userN= await getUser(ctx);
        if(userN==null)
            ctx.body = ctx.render('korzina',{isLoged:false, email:'',phone:"", time:updateTime});
        else
            ctx.body = ctx.render('korzina',{isLoged:true, name:getFIO(userN.name), email:userN.email,phone:userN.phone, time:updateTime, fio:userN.name});
    }
    else
        ctx.body = ctx.render('korzina',{isLoged:false, email:'',phone:"", time:updateTime});
};

exports.post=async function (ctx, next) {

    var massID=ctx.request.body.data.map((item)=>{
        var a=null;
        try{
            a= parseInt(item);
        }
        catch(e) {

        }
        if(a!=null)
            return a;
    });
    var data=await Data.find({_id:{ $in : massID }});

    if(await isLogged(ctx)){
        var UserN= await getUser(ctx);
        ctx.body = {Products:data, login:true, User:UserN};

    }
    else{
        data.forEach(function (item) {
            item.specialPrice1='null';
            item.specialPrice2='null';
            item.specialPrice3='null';
            item.specialPrice4='null';
        });

        ctx.body = {Products:data, login:false};
    }






};

function addProto() {
    String.prototype.toObjectId = function() {
        var ObjectId = (require('mongoose').Types.ObjectId);
        return new ObjectId(this.toString());
    };
}

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
