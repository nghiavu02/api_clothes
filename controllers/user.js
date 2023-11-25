const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const {createAccessToken, createRefreshToken} = require('../middleware/jwt')
//đăng ký
const register = asyncHandler(async(req, res)=>{
    const {email,username, password, fullname} = req.body
    if(!email || !username || !password || !fullname) throw new Error('Missing input')
    const checkUsername = await User.findOne({username})
    if(checkUsername) throw new Error('User name has exists')
    const user = await User.create(req.body)
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'Đăng ký thành công. Vui lòng đăng nhập ...' : 'Đăng ký thất bại',
        data: user ? user : null
    })
})
//đăng nhập
const login = asyncHandler(async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password) throw new Error('Missing inputs');
    const user = await User.findOne({ username });
    if (user && await user.isCorrectPassword(password)) {
        const { password, role, ...userData } = user.toObject();
        const accessToken = createAccessToken(user._id, role);
        const refreshToken = createRefreshToken(user._id);
        await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken }, { new: true }).select('-password -role');
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({
            success: true,
            message: 'Login thành công',
            accessToken,
            userData
        });
    }
});
//lấy ra thông tin user
const getCurrent = asyncHandler(async(req, res)=>{
    const {_id} = req.user
    console.log(req.user)
    const user = await User.findById(_id).select('-password -role -refreshToken')
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'Lấy ra thông tin của user thành công' : 'lấy ra thông tin thất bại',
        data: user ? user : null
    })
})
//lấy ra nhiều user
const getUsers = asyncHandler(async(req, res) =>{
    const users = await User.find().select('-password -role -refreshToken')
    return res.status(200).json({
        success: users ? true : false,
        message: users ? 'Lấy ra danh sách user thành công' : 'lấy ra thất bại',
        data: users ? users : null
    })
})
//Update user by user
const updateUser = asyncHandler(async(req, res) =>{
    const {_id} = req.user
    if(!_id || Object.keys(req.body).length === 0) throw new Error('Missing input')
    const user = await User.findByIdAndUpdate(_id, req.body, {new: true}).select('-password -role')
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'Cập nhật thông tin thành công' : 'Cập nhật thông tin thất bại',
        data: user ? user : null
    })
})
//Update user by admin
const updateUserByAdmin = asyncHandler(async(req, res) =>{
    const {uid} = req.params
    if(!uid || Object.keys(req.body).length == 0) throw new Error('Missing inputs')
    const user = await User.findByIdAndUpdate(uid, req.body, {new: true})
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'Cập nhật thông tin thành công' : 'Cập nhật thông tin thất bại',
        data: user ? user : null
    })
})
//Xóa user 
const deleteUser = asyncHandler(async(req, res) =>{
    const {_id} = req.user
    const user = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'Xóa user thành công' : 'Xóa user thất bại',
    })

})
//logout
const logout = asyncHandler(async(req, res) =>{
    const cookie = req.cookies
    if(cookie && cookie.refreshToken){
        await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ''}, {new: true})
    }
    else throw new Error('token in cookie valid')

})
//refreshToken
//forgotpassword
//resetpassword
module.exports = {
    register,
    login,
    getCurrent,
    getUsers,
    updateUser,
    updateUserByAdmin,
    deleteUser,
    logout

}