const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    fullname:{
        type:String,
        required:true,
    },
    //nam 1 nu 0
    gender: {
        type: Number,
        default: 1
    },

    mobile: {
        type: String,
        
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type: String,
        default: "User"
    },
    avatar: {
        type: String,
        
    },
    cart: [
        {
            product: {type: mongoose.Types.ObjectId, ref: 'Product'},
            quantity: {type: Number, default: 1},
            size: {type: mongoose.Types.ObjectId, ref: 'Size'},
            color:{type: mongoose.Types.ObjectId, ref: 'Color'}
        }
    ],
    address: {
        type: String,
    },
    wishlist: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Product'
        }
    ],
    refreshToken: {
        type: String,
    },
    passwordChangeAt: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: String
    }
},{
    timestamps: true
});
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt = bcrypt.genSaltSync(process.env.AMOUNT_SALT)
    this.password =await bcrypt.hash(this.password, salt)
})
userSchema.methods = {
    isCorrectPassword: async function(password){
        return await bcrypt.compare(password, this.password)
    },
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000
        return resetToken
    }
}
//Export the model
module.exports = mongoose.model('User', userSchema);