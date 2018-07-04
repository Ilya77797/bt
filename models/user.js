const mongoose = require('mongoose');
const crypto = require('crypto');
const sha256=require('sha256');
const _ = require('lodash');
const config = require('../config/default');

const userSchema = new mongoose.Schema({
    _id:{
        type:String,
        unique:true
    },
  displayName:   {
    type:     String,
    required: "Имя пользователя отсутствует."
  },
  role: {
    type: String,
  },
  username:         {
    type:     String,
    unique:   true,
    required: "Поле не может быть пустым.",

  },
  visiblePrice:{
    type: Array,
  } ,

    discount:{
      type:String,
    },

    curPrice:{
    type:String,
    },

    showSP_Price:{
    type:Boolean
    },
    useDiscount:{
    type:Boolean
    },

  passwordHash: {
    type: String,
    required: true
  },
  salt: {
    required: true,
    type: String
  },
    email:{
    type:String
    },
    phone:{
        type:String
    }
}, {
  timestamps: true
});

userSchema.virtual('password')
  .set(function(password) {

    if (password !== undefined) {
      if (password.length < 4) {
        this.invalidate('password', 'Пароль должен быть минимум 4 символа.');
      }
    }

    this._plainPassword = password;

    if (password) {
      this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(
        password,
        this.salt,
        config.crypto.hash.iterations,
        config.crypto.hash.length,
        'sha256'
      ).toString('base64');
    } else {

      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function() {
    return this._plainPassword;
  });

//Виртуальное поле для проверки пароля
userSchema.methods.checkPassword = function(password) {
  if (!password) return false;
  if (!this.passwordHash) return false;
    var ph256=sha256(password);//Получение хэша sha256 от введенного пользователем пароля
    const passwordHash = crypto.pbkdf2Sync(//paswordHash хранится в бд
    ph256,
    this.salt,
    config.crypto.hash.iterations,
    config.crypto.hash.length,
    'sha256'
  ).toString('base64');

  return passwordHash === this.passwordHash;

};

userSchema.methods.getPublicFields = function() {
  return {
    username: this.username,
    displayName: this.displayName
  };

};

userSchema.methods.getId=function () {
    return this._id;
}

module.exports = mongoose.model('User', userSchema);
