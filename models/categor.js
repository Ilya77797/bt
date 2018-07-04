//В папке Models храняться описания схем mondoDB для хранения категорий, пользователей, информаци о товарах и дополнительной информации(info)
const mongoose = require('mongoose');
const config = require('../config/default');
const categorShema=new mongoose.Schema({
    name:String,
    subcat:mongoose.Schema.Types.Mixed,
    index:Number
},
);

module.exports = mongoose.model('Categor', categorShema);
