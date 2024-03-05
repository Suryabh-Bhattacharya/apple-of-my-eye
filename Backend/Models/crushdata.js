const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CrushdataSchema = new Schema({
    crushNames:[{
        name:{
            type:String,
            required:true
        },
        rollno:{
            type:Number,
            required:true
        }
    }],
    userId:{
        type: Schema.Types.ObjectId,
        ref : 'User',
        required:true
    }
})
module.exports = mongoose.model('Crush',CrushdataSchema);
