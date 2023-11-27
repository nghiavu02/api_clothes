const Order = require('../models/order');
const user = require('../models/user');
const User = require('../models/user');
const Voucher = require('../models/voucher')
const asyncHandler = require('express-async-handler');
const create = async(req, res)=>{
    try {
        const {_id} = req.user
        const {vid} = req.body
        let total = 0, discount = 0
        const userCart = await User.findById(_id).select('cart').populate('cart.product', 'name price').populate('cart.size', 'name').populate('cart.color', 'name')
        const product = userCart?.cart?.map(item => ({
            product_id: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            size: item.size?.name,
            color: item.color?.name,
            
        }))
        console.log(product)
        total = userCart?.cart?.reduce((sum, item) => item.product.price * item.quantity + sum, 0)
        const checkvoucher = await Voucher.findById(vid).select('discount')
        if(checkvoucher){
            discount = checkvoucher.discount
            total = total * (1 - discount/100)
        }
        const rs = await Order.create({product,voucher: vid, orderBy: _id, total})
        return res.status(200).json({
            success: rs ? true : false,
            message: rs ? 'Thành công' : 'Thất bại',
            data: rs
        })
    } catch (error) {
        res.status(504).json({
            success: false,
            message: `Có lỗi xảy ra :${error.message}`
        })
    }
}
const updateStatus = async(req, res) =>{
    try {
        const {oid} = req.params
        const {status} = req.body
        const order = await Order.findById(oid).select('status')
        const checkStatus = order.status === status
        console.log(status, checkStatus)
        
        if(checkStatus) throw new Error('status update bị trùng. mời nhập thông tin khác')
        const rs = await Order.findByIdAndUpdate(oid, {status: status}, {new: true})
        return res.status(200).json({
            success: rs ? true : fasle,
            message: rs ? 'Thành công' : 'Thất bại',
            data: rs
        })
    } catch (error) {
        res.status(504).json({
            success: false,
            message: ` Có lỗi xảy ra: ${error.message}`
        })
    }
}
const getUserOrder = async(req, res) =>{
    try {
        const {_id} = req.user
        const rs = await Order.find({orderBy: _id}).populate('product.size', 'name')
        return res.status(200).json({
            success: rs ? true : fasle,
            message: rs ? 'Thành công' : 'Thất bại',
            data: rs
        })
    } catch (error) {
        res.status(504).json({
            success: false,
            message: ` Có lỗi xảy ra: ${error.message}`
        })
    }
    
}

const getOrder = asyncHandler(async (req, res) => {
    const response = await Order.find();
    return res.json({
        success: response ? true:false,
        response: response ? response : 'Something went wrong'
    })
})
module.exports = {
    create,
    updateStatus,
    getUserOrder,
    getOrder
}