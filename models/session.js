const mongoose = require('mongoose');
const session=new mongoose.Schema({

        sid:{
            type:String
        },
        blob:{
            type:String
        },
        user:{
            type: String
        }
    },
    {}
);

module.exports = mongoose.model('sessions', session);
