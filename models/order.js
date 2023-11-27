const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    product:[{
        product_id: {type: mongoose.Types.ObjectId, ref: 'Product'},
        name: String,
        quantity: Number,
        size:String,
        color:String
    }],
    voucher_id: {type: mongoose.Types.ObjectId, ref: 'Voucher'},
    status:{
        type:String,
        default: 'Proccessing',
        enum: ['Cancelled', 'Proccessing', 'Successed']
    },
    total: Number,
    voucher:{
        type:mongoose.Types.ObjectId,
        ref: 'Voucher'
    },
    orderBy:{
        type:mongoose.Types.ObjectId,
        ref: 'User'
    },
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);