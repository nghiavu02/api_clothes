const Brand = require('../models/brand')
const asyncHandler = require('express-async-handler')
//C: Thêm 
const createBrand = asyncHandler(async(req, res) =>{
    const {name} = req.body
    if(!name) throw new Error('Missing inputs')
    const rs = await Brand.create({name})
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'Thêm thành công' : 'Thêm mới thất bại',
        data: rs
    })
})
//R: Lấy 1 
const getBrand = asyncHandler(async(req, res)=>{
    const {bid} = req.params
    if(!bid) throw new Error('Missing inputs')
    const rs = await Brand.findById(bid)
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'Get thành công' : 'Get thất bại',
        data: rs
    })
})
//R: lấy ra 1 list
const getBrands = asyncHandler(async(req, res) =>{
    const rs = await Brand.find().select('_id name')
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'thành công' : 'thất bại',
        data: rs
    })
})
//U: Sửa 
const updateBrand = asyncHandler(async(req, res)=>{
    const {bid} = req.params
    if(!bid|| Object.keys(req.body).length == 0) throw new Error('Missing inputs')
    const rs = await Brand.findByIdAndUpdate(bid, req.body, {new: true})
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'thành công' : 'thất bại',
        data: rs
    })
})
//D: Xóa 
const deleteBrand = asyncHandler(async(req, res)=>{
    const {bid} = req.params
    if(!bid) throw new Error('Missing input')
    const rs = await Brand.findByIdAndDelete(bid)
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'xóa thành công' : 'xóa hất bại',
    })
})
module.exports = {
    createBrand,
    getBrand,
    getBrands,
    updateBrand,
    deleteBrand
}