const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        require: true,
        unique: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: true,
    },
    image:{
        type: Array,
    },
    brand: {
        type: mongoose.Types.ObjectId,
        ref: 'Brand'
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    rating: [
        {
            star: {type: Number},
            postedBy: {type: mongoose.Types.ObjectId, ref: 'User'},
            comment: {type: String}
        }
    ],
    totalRating: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Product', productSchema)