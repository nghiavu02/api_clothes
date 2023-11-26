const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const sendToEmail = require('../ultils/sendMail')
const crypto = require('crypto')
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

//upload image
const uploadImage = asyncHandler(async(req, res)=>{
    const {_id} = req.user
    if(!req.file || !_id) throw new Error('missing input')
    const user = await User.findByIdAndUpdate(_id, {avatar: req.file.path}, {new: true})
    return res.status(200).json({
        success: true,
        message: 'upload avatar thành công',
        data: user
    })
})
//update address
const updateAddress = asyncHandler(async(req, res)=>{
    const {_id} = req.user
    const {address} = req.body
    console.log(_id, address)
    if(!_id || !address) throw new Error('Mising inputs')
    const user = await User.findByIdAndUpdate(_id, {address: address}, {new: true}).select('')
    return res.status(200).json({
        success: true,
        message: 'thành công',
        data: user
    })
})
//refreshToken
const refreshAccessToken = asyncHandler(async (req, res, next) => {
    //lấy token từ cookie
    const cookie = req.cookies
    //check xem có token hay không
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in  cookies')
    //check xem token có hợp lệ không
    await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET, async (err, decode) => {
        if (err) throw new Error('Invalid refresh token')
        //check token có khớp với token đã lưu trong db
        const response = await User.findOne({ _id: decode._id, refreshToken: cookie.refreshToken })
        return res.status(200).json({
            success: response ? true : false,
            newAccessToken: response ? generateAccessToken(response._id, response.role) : 'refresh token not matched'
        })
    })
})
//forgotpassword
const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.query;
    if (!email) return next(new Error('Missing email'));

    const user = await User.findOne({ email });
    if (!user) return next(new Error('User not found'));

    const resetToken = user.createPasswordChangedToken();
    await user.save();

    const html = `Xin vui lòng click vào link để thay đổi mật khẩu. Link có hiệu lực trong vòng 15 phút <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;
    const data = {
        email,
        html,
    };

    console.log(email);
    try {
        const rs = await sendToEmail(email, html);
        return res.status(200).json({
            success: true,
            result: rs,
        });
    } catch (error) {
        return next(error);
    }
});
//resetpassword
const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error("Mising inputs")
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    user.passwordChangeAt = Date.now()
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'mật khẩu đã được thay đổi' : 'lỗi password'
    })
})

module.exports = {
    register,
    login,
    getCurrent,
    getUsers,
    updateUser,
    updateUserByAdmin,
    deleteUser,
    logout,
    updateAddress,
    uploadImage,
    refreshAccessToken,
    forgotPassword,
    resetPassword

}