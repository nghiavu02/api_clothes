const { default: slugify } = require('slugify')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const { query } = require('express')
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
const getAll = asyncHandler(async (req, res, next) => {
    const queries = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(item => delete queries[item])
    //advanced filtering 
    let queryString = JSON.stringify(queries)
    //tìm chỗi gte thay thế bằng => $get
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    const formatedQueries = JSON.parse(queryString)

    //filtering
    //regex: , 'i': không phân biệt hoa thường
    if (queries?.name) formatedQueries.name = { $regex: queries.name, $options: 'i' }
    let queryCommand = Product.find(formatedQueries)
    //sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }
    else {
        queryCommand = queryCommand.sort('-createAt')
    }
    //Field limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    //Pagination
    const page = +req.query.page * 1 || 1;
    const limit = +req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);
    //  Execute query
    queryCommand.then(async (response) => {
        const counts = await Product.find(formatedQueries).countDocuments()
        res.status(200).json({
            success: response ? true : false,
            message: response ? "Lấy ra sản phẩm" : "lấy sản phẩm thất bại",
            counts,
            page,
            products: response ? response : null,
        })
    }).catch(next)
})
/*b1 lấy dữ liệu từ req.query
b2 tạo mảng gồm limit, page, sort, fields
b3 lặp qua mảng để xóa các phần tử query có các trường trong mảng
b4 chuyển về json để thay thế các trường [gte|gt|lte|lt] = [$get|$gt|$lte|$lt]
b5 chuyển về object
Tìm kiếm trong chuỗi có chuỗi cần tìm
 6.1 check xem  name ko có tìm bằng $regex và $options: 'i' không phân biệt hoa thường
 Sort
6.2.1 kiểm tra nếu có sort thì tách các field nhập trong sort ra 
6.2.2  dùng hàm sort
Fields (select)
6.3.1 Kiểm tra có nhập fields không thì tách tương tự sort
6.3.2 dùng hàm select
pagination
6.4.1 nấy dữ liệu nhập vào limit, page, tính skip
6.4.2 dùng hàm skip()limit()
b7 trả về json
*/


//Get product by id
const getById = async(req, res) =>{
    try{
        const {pid} = req.params
        if(!pid) throw new Error('Missing input')
        const rs = await Product.findById(pid).populate('color', 'name code')
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
//ratings
const ratings = async(req, res) =>{
    //b1 lấy _id user và star comment pid của product
    //b2 check dữ liệu
    //b3 lấy ra product có pid
    //b4 kiểm tra _id trong rating của product đã đánh giá có trùng _id user đang đánh giá ko
    // -trùng thì update đánh giá
    // - ko trùng thì thêm mới
   try {
        const {_id} = req.user
        const {star, comment, pid} = req.query
        const product = await Product.findById(pid)
        const checkRating = product.rating.find((item=> item.postedBy.toString() == _id.toString()))
        if(checkRating){
            //update rating
            await Product.updateOne({
                rating: {$elemMatch: {postedBy: _id}}
            },{
                $set: { 'rating.$.star': star, 'rating.$.comment': comment}
            })
        }else{
            await Product.findByIdAndUpdate(pid, {
                $push :{ rating :{star, comment, postedBy: _id}}
            })
        }
        const rs = await Product.findById(pid)
        const countRating = rs.rating.length
        const sumStar = rs.rating.reduce((sum, e)=> sum + e.star, 0)
        rs.totalRating = Math.ceil(sumStar * 10/ countRating) / 10
        rs.save()
        return res.status(200).json({
            success: rs ? true : false,
            message:  rs ? "Rating thành công" : 'thất bại',
            data: rs
        })
   } catch (error) {
        res.status(504).json({
            message: `Có lỗi xảy ra ${error.message}`,
            success: false
        })
   }
}
const uploadImage = async(req, res) =>{
    try {
        if(!req.files) throw new Error('upload file image error')
        const {pid} = req.params
        const product = await Product.findByIdAndUpdate(pid, {$push : {image: {$each: req.files.map(item => item.path)}}}, {new: true})
        return res.status(200).json({
            success: true,
            message: 'upload image thành công',
            data: product
        })
    } catch (error) {
        res.status(504).json({
            message: `Co lỗi xảy ra: ${error.message}`,
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
    deleteById,
    ratings,
    uploadImage
}