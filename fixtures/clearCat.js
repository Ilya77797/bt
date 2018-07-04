const mongoose=require('../libs/mongoose');
const Categor=require('../models/categor');
async function q1() {
    await Categor.remove({});
    console.log('categories deleted');
}


module.exports=q1;