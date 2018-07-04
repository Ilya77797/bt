let clearData=require('./clearDateBase');
let clearCat=require('./clearCat');
let clearUser=require('./clearUsers');
module.exports=async function (clearUsers_f,clearCat_f,clearData_f) {
    if(clearData_f)
        await clearData();
   /* if(clearUsers_f)
        await clearUser();*/
    if(clearCat_f)
       await clearCat()

}