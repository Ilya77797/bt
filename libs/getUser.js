//var session=require('../libs/mongoose');
var session=require('../models/session');
const mongoose=require('../libs/mongoose');
const User=require('../models/user');

async function getUser(ctx) {
    console.log('ctx', ctx);
    console.log('ctxSes', ctx.sessionId);
    var cook=ctx.cookies.get('sid');

    /*var ses=ctx.sessionId;*/
   // var sesObj= await session.models.Session.find({sid:`koa:sess:${cook}`});

     var sesObj= await session.find({sid:`koa:sess:${cook}`});

    if(sesObj==undefined||sesObj.length==0)
        return null
    var userId=sesObj[0].user;
    if(userId==undefined)
        return null
    var c=userId
    var user= await User.find({"_id":userId});
    var UserN={
        name:user[0].displayName,
        phone:user[0].phone||'',
        price:user[0].visiblePrice,
        discount:user[0].discount,
        curPrice:user[0].curPrice,
        show:user[0].showSP_Price,
        useDiscount:user[0].useDiscount,
        _id:user[0]._id,
        email:user[0].email
    };
    return UserN;
}

module.exports=getUser;