const { default: slugify } = require('slugify')
const Product = require('../models/product')
//Thêm mới
const create = async(req, res)=>{
    try {
        if(Object.keys(req.body).length == 0) throw new Error('Missing inputs')
        if(req.body && req.body?.name) req.body.slug = slugify(req.body.name)
        const rs = await Product.create(req.body)
        return res.status(200).json({
            success: rs ? true : false,
            message: rs ? 'thành công' : 'thất bại',
            data: rs
        })
    } catch (error) {
        res.status(504).json({
            message: `Có lỗi xảy ra: ${error.message}`,
            success: false
        })
    }    
}

//get all
const getAll = async(req, res) =>{
    try {
        const rs = await Product.find().select('-createdAt -updatedAt -__v')
        return res.status(200).json({
            success: rs ? true : false,
            message: rs ? 'thành công' : 'thất bại',
            data: rs
        })
    } catch (error) {
        res.status(504).json({
            message: `Có lỗi xảy ra: ${error.message}`,
            success: false
        })
    }
}
//Get product by id
const getById = async(req, res) =>{
    try{
        const {pid} = req.params
        if(!pid) throw new Error('Missing input')
        const rs = await Product.findById(pid)
        return res.status(200).json({
            success: rs ? true : false,
            message: rs ? 'Lấy ra thành công' : 'lấy ra thất bại',
            data: rs
        })
    }catch(error){
        res.status(504).json({
            message: `Có lỗi xảy ra: ${error.message}`,
            success: false
        })
    }
}
//get by name
const getByName = async(req, res) =>{
    try {
        const {name} = req.query
        const rs = await Product.findOne({name})    
        return res.status(200).json({
            success: rs ? true : false,
            message: rs ? 'thành công' : 'thất bại',
            data: rs
        })
    } catch (error) {
        res.status(504).json({
            message: `Có lỗi xảy ra: ${error.message}`,
            success: false
        })
    }
}
//get by slug
//update by id
const updateById = async(req, res) =>{
    try {
        const {pid} = req.params
        if(!pid || Object.keys(pid).length == 0) throw new Error('Mising inputs')
        const rs = await Product.findByIdAndUpdate(pid, req.body, {new: true})
        return res.status(200).json({
            success: rs ? true : false,
            message: rs ? 'update thành công' : 'update thất bại',
            data: rs
        })
    } catch (error) {
        res.status(504).json({
            message: `Có lỗi xảy ra: ${error.message}`,
            success: false
        })
    }
}
//delete by id
const deleteById = async(req, res) =>{
    try {
        const {pid} = req.params
        if(!pid) throw new Error('Params does not exists')   
        const rs = await Product.findByIdAndDelete(pid)
        return res.status(200).json({
            success: rs ? true : false,
            message: rs ? 'Xóa thành công' : 'Xóa thất bại',
        })
    } catch (error) {
        res.status(500).json({
            message: `Có lỗi xảy ra ${error.message}`,
            success: false
        })
    }
}
module.exports = {
    getAll,
    getById,
    getByName,
    create,
    updateById,
    deleteById
}