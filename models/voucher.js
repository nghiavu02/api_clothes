const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var voucherSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true,
    },
    discount: {
        type: Number,
        required: true
    },
    start:{
        type:Date,
        default: Date.now()
    },
    end:{
        type:Date,
        default: Date.now()
    },
    update: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Voucher', voucherSchema);