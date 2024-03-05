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
//this function will be called before  save has been runned on userschema
//wont contain doc as it has not been saved yet
UserSchema.pre('save',async function (next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})
//this function will be called when the save has been runned on userschema
// UserSchema.post('save',function (doc,next){
//     next();
// })
module.exports = mongoose.model('User',UserSchema);
