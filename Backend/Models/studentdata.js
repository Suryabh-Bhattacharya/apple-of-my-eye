const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentdataSchema = new Schema({
    RollNo:{
        type: Number,
        required:true,
        unique: true
    },
    Name:{
        type:String,
        required: true,
    },
    Branch:{
        type:String,
        required: true,
    },
    Gender:{
        type: String,
        required: true
    },
    Batch:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('Studentdata',StudentdataSchema);
