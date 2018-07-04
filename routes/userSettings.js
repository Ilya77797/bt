
var getUser=require('../libs/getUser');
var UserDB=require('../models/user');
exports.get=async function(ctx, next) {

var USER= await  getUser(ctx);
    ctx.body=USER;
};

exports.post=async function(ctx, next) {
    if(ctx==undefined){

    }
    var USER= await  getUser(ctx);
    var req=ctx.request.body;
    var flag=false;
    var flag2=false;
    if(USER.curPrice!=req.curPrice||USER.show!=req.showSP_Price||USER.useDiscount!=req.useDiscount)
        flag=true;
   /* if(USER.useDiscount!=req.useDiscount)
        flag2=true;*/

    if(flag) {
        var u = await UserDB.find({_id: USER._id});
        u[0].curPrice=req.curPrice;
        u[0].showSP_Price=req.showSP_Price;
        u[0].useDiscount=req.useDiscount;
        await u[0].save();
        ctx.body={done:true, goToCart:flag2};
    }
    else {
        ctx.body={done:false};
    }

};