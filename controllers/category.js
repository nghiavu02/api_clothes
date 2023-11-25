const Category = require('../models/category')
const asyncHandler = require('express-async-handler')
//C: Thêm 
const createCategory = asyncHandler(async(req, res) =>{
    const {title} = req.body
    if(!title) throw new Error('Missing inputs')
    const rs = await Category.create({title})
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'Thêm thành công' : 'Thêm mới thất bại',
        data: rs
    })
})
//R: Lấy 1 
const getCategory = asyncHandler(async(req, res)=>{
    const {cid} = req.params
    if(!cid) throw new Error('Missing inputs')
    const rs = await Category.findById(cid)
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'Get thành công' : 'Get thất bại',
        data: rs
    })
})
//R: lấy ra 1 list
const getCategorys = asyncHandler(async(req, res) =>{
    const rs = await Category.find().select('_id title')
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'thành công' : 'thất bại',
        data: rs
    })
})
//U: Sửa 
const updateCategory = asyncHandler(async(req, res)=>{
    const {cid} = req.params
    if(!cid|| Object.keys(req.body).length == 0) throw new Error('Missing inputs')
    const rs = await Category.findByIdAndUpdate(cid, req.body, {new: true})
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'thành công' : 'thất bại',
        data: rs
    })
})
//D: Xóa 
const deleteCategory = asyncHandler(async(req, res)=>{
    const {cid} = req.params
    if(!cid) throw new Error('Missing input')
    const rs = await Category.findByIdAndDelete(cid)
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'xóa thành công' : 'xóa hất bại',
    })
})
module.exports = {
    createCategory,
    getCategory,
    getCategorys,
    updateCategory,
    deleteCategory
}