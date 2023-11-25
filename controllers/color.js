const Color = require('../models/color')
const asyncHandler = require('express-async-handler')
//Thêm
const createColor = asyncHandler(async(req, res)=>{
    const {name} = req.body
    if(!name) throw new Error('Missing inputs')
    const check = await Color.findOne({name})
    if(check) throw new Error('Name color has exists')
    const rs = await Color.create(req.body)
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'Tạo mới color thành công': 'Tạo mới color thất bại',
        data: rs
    })
})
//Lấy 1 màu
const getColor = asyncHandler(async(req, res)=>{
    const {clid} = req.params
    if(!clid) throw new Error('Missing inputs')
    const rs = await Color.findById(clid)
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'lấy  thành công' : 'get thất bại',
        data: rs
    })
})
//lấy ra nhiều màu
//lấy ra nhiều user
const getColors = asyncHandler(async(req, res) =>{
    const rs = await Color.find().select('_id name')
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'Lấy ra danh sách color thành công' : 'lấy ra thất bại',
        data: rs ? rs : null
    })
})
//Sửa 
const updateColor = asyncHandler(async(req, res)=>{
    const {clid} = req.params
    if(!clid || Object.keys(req.body).length == 0) throw new Error('Missing inputs')
    const rs = await Color.findByIdAndUpdate(clid, req.body, {new: true})
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'Sửa thành công' : 'Sửa thất bại',
        data: rs
    })
})
//Xóa
const deleteColor = asyncHandler(async(req, res) =>{
    const {clid} = req.params
    // if(!clid) throw new Error('Missing inputs')
    const rs = await Color.findByIdAndDelete(clid)
    return res.status(200).json({
        success: rs ? true : false,
        message: rs ? 'Xóa  thành công' : 'Xóa thất bại',
    })

})
module.exports = {
    createColor,
    getColor,
    getColors,
    updateColor,
    deleteColor
}