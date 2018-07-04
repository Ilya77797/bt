const passport = require('koa-passport');
const compose = require('koa-compose');
//var session=require('../libs/mongoose');
var session=require('../models/session');
let User = require('../models/user');
const Info=require('../models/info');
const mongoose=require('mongoose');
exports.post = async (ctx, next) => {
    //await passport.authenticate('local');
    var a =await auth(ctx);
    if (ctx.state.user) {
        var ses={
            sid:`koa:sess:${ctx.sessionId}`,
            blob:`{"cookie":{"httpOnly":true,"path":"/","overwrite":true,"signed":false,"maxAge":14400000}`,
            user:ctx.state.user._id
        };
       // var curSes=new session.models.Session(ses);
        var curSes=new session(ses);
        try {
            await curSes.save();
            console.log(`--- ${new Date(Date.now()+10800000).toISOString().replace(/T/, ' ').replace(/\..+/, '')}--- session is saved: Sid${ses.sid} | sesUser${ses.user}`);
        }
        catch (e){
            console.log('error saving session');
        }
        if(ctx.request.ctx.params.f==':main')
            ctx.redirect('/');
        else
            ctx.redirect('/corzina');
    } else {
        if(ctx.request.ctx.params.f==':main'){
            try{
                var INFO=await Info.find({_id:0});
                var updateTime=Math.round((Date.now()-INFO[0].time)/60000);
            }
            catch(e){

            }
            ctx.body=ctx.render('main',{isLoged:false, noUser:true, time:updateTime});
        }
        else
            ctx.body=ctx.render('korzina',{isLoged:false, noUser:true});

    }
  };

async function auth(ctx) {
    let username=ctx.request.body.username;
    let password=ctx.request.body.password;
    var user=await User.findOne({ username });
    console.log('usName: ', username);
        console.log('User: ',user);
        if (!user || !user.checkPassword(password)) {
            // don't say whether the user exists
            console.log('no user');
            return  0
        }
        else {
            ctx.state.user=user;
        }



}



