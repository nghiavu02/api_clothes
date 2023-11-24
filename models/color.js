const mongoose = require('mongoose'); 


var colorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    
});


module.exports = mongoose.model('Color', colorSchema);