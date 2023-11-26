const mongoose = require('mongoose'); 


var colorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    code:{
        unique:true,
        type: String,
        required: true,
    },

    
});


module.exports = mongoose.model('Color', colorSchema);