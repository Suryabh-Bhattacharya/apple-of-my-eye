const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
    phoneNumber:{
        type:Number,
        required: true,
        unique: true,
    },
    rollNo:{
        type:Number,
        required:true,
        unique:true,
    },
    password:{
        type: String,
        required: true,
    },
    isMatched:{
        type:Boolean,
        default: false
    },
    crushId:{
        type: Schema.Types.ObjectId,
        ref : 'User',
        default:null
    },
    crushDataId:{
        type: Schema.Types.ObjectId,
        ref : 'Crush',
        default:null,
    }
})

module.exports = mongoose.model('User',UserSchema);
