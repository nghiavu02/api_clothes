const Voucher = require('../models/voucher')
//Lấy danh sách voucher
const getAll = async(req, res) =>{
    try {
        const rs = await Voucher.find().select('-createdAt -updatedAt -__v')
        return res.status(200).json({
            success: rs ? true : false,
            message: rs ? 'thành công' : 'thất bại',
            data: rs
        })
    } catch (error) {
        res.status(504).json({
            message: `Có lỗi xảy ra: ${error.message}`,
            error: 1
        })
    }
}
//Lấy 1 voucher by id
const getById = async(req, res) =>{
    try {
        const {vid} = req.params
        const rs = await Voucher.findById(vid).select('-createdAt -updatedAt -__v')
        if(!rs) throw new Error('Voucher does not exists')

        return res.status(200).json({
            success: rs ? true : false,
            message: rs ? 'thành công' : 'thất bại',
            data: rs
        })
    } catch (error) {
        res.status(504).json({
            message: `Có lỗi xảy ra: ${error.message}`,
            error: 1
        })
    }
}
//get voucher by code
const getVoucherByCode = async(req, res) =>{
    try {
        const {code} = req.params
        const rs = await Voucher.findOne({code})    
        return res.status(200).json({
            success: rs ? true : false,
            message: rs ? 'thành công' : 'thất bại',
            data: rs
        })
    } catch (error) {
        res.status(504).json({
            message: `Có lỗi xảy ra: ${error.message}`,
            error: 1
        })
    }
}
//Thêm voucher
const createVocher = async(req, res) =>{
    try {
        const {code} = req.body
        if(Object.keys(req.body).length == 0) throw new Error('Missing input')
        const checkCode = await Voucher.findOne({code})
        if(checkCode) throw new Error('Mã code đã tồn tại')
        const rs = await Voucher.create(req.body)
        return res.status(200).json({
            success: rs ? true : false,
            message: rs ? 'Thêm mới thành công' : 'Thêm mới thất bại',
            data: rs
        })
    } catch (error) {
        res.status(500).json({
            message: `Có lỗi xảy ra ${error.message}`,
            error: 1,
        })
    }
}
//Cập nhật voucher
const updateById = async(req, res) =>{
    try {
        const {vid} = req.params
        if(!vid || Object.keys(vid).length == 0) throw new Error('Mising inputs')
        const rs = await Voucher.findByIdAndUpdate(vid, req.body, {new: true})
        return res.status(200).json({
            success: rs ? true : false,
            message: rs ? 'thành công' : 'thất bại',
            data: rs
        })
    } catch (error) {
        res.status(504).json({
            message: `Có lỗi xảy ra: ${error.message}`,
            error: 1
        })
    }
}
//Xóa voucher
const deleteVoucher = async(req, res) =>{
    try {
        const {vid} = req.params
        if(!vid) throw new Error('Params does not exists')   
        const rs = await Voucher.findByIdAndDelete(vid)
        return res.status(200).json({
            success: rs ? true : false,
            message: rs ? 'Xóa thành công' : 'Xóa thất bại',
        })
    } catch (error) {
        res.status(500).json({
            message: `Có lỗi xảy ra ${error.message}`,
            error: 1,
        })
    }
}


module.exports = {
    getAll,
    getById,
    getVoucherByCode,
    createVocher,
    updateById,
    deleteVoucher
}