const Size = require('../models/size')
const asyncHandler = require('express-async-handler')
//C: Thêm size
const createSize = asyncHandler(async(req, res) =>{
    const {name} = req.body
    if(!name) throw new Error('Missing inputs')
    const rs = await Size.create({name})
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'Tạo size thành công' : 'Tạo size thất bại',
        data: rs
    })
})
//R: Lấy 1 size
const getSize = asyncHandler(async(req, res)=>{
    const {sid} = req.params
    if(!sid) throw new Error('Missing inputs')
    const rs = await Size.findById(sid)
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'Get thành công' : 'Get thất bại',
        data: rs
    })
})
//R: lấy ra 1 list size
const getSizes = asyncHandler(async(req, res) =>{
    const rs = await Size.find().select('_id name')
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'thành công' : 'thất bại',
        data: rs
    })
})
//U: Sửa size
const updateSize = asyncHandler(async(req, res)=>{
    const {sid} = req.params
    if(!sid|| Object.keys(req.body).length == 0) throw new Error('Missing inputs')
    const rs = await Size.findByIdAndUpdate(sid, req.body, {new: true})
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'thành công' : 'thất bại',
        data: rs
    })
})
//D: Xóa size
const deleteSize = asyncHandler(async(req, res)=>{
    const {sid} = req.params
    if(!sid) throw new Error('Missing input')
    const rs = await Size.findByIdAndDelete(sid)
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'xóa thành công' : 'xóa hất bại',
    })
})
module.exports = {
    createSize,
    getSize,
    getSizes,
    updateSize,
    deleteSize
}