//Здесь хранится дополнительная информация, такая как номер заказа(orderId) и хэш last.json(для отслеживания изменений в этом файле)
const mongoose = require('mongoose');

const infoShema=new mongoose.Schema({
        _id:{
            type:Number
        },
        orderId:{
            type:Number
        },
    fileHash:{
            type:String
    },
    time:{
            type: String
    }
    },
    {}
);

module.exports = mongoose.model('Info', infoShema);