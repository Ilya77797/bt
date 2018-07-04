const mongoose=require('../libs/mongoose');
var Categor=require('../models/categor');
exports.get=async function(ctx, next) {

    ctx.body=await Categor.find({}).sort('index');

};

function deepSearch(catregor, reg, resMass) {
    if(catregor.name.match(req)){
        resMass.push(catregor);
    }
    if(catregor.subcat==null)
        return
    else{
        catregor.subcat.forEach((item)=>{
            if(item.name.match(req)){
                resMass.push(item);
            }
            else {
                deepSearch(item,reg,resMass);
            }
        });
    }
}


