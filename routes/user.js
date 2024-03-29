const router = require('express').Router()
const ctrls = require('../controllers/user')
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken')
const uploadFile = require('../config/cloudinary.config')

router.put('/upload-image', [verifyAccessToken, isAdmin],uploadFile.single('image'),ctrls.uploadImage)
router.post('/register', ctrls.register)
router.post('/login', ctrls.login)
router.put('/updateCart', verifyAccessToken,ctrls.updateCart)
router.get('/getcurrent',verifyAccessToken, ctrls.getCurrent)
router.get('/getusers',verifyAccessToken, isAdmin, ctrls.getUsers)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/forgotpassword', ctrls.forgotPassword)
router.post('/resetpassword', ctrls.resetPassword)
router.get('/logout', verifyAccessToken,ctrls.logout)
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)
router.put('/', [verifyAccessToken],ctrls.updateUser)
router.get('/', verifyAccessToken, isAdmin, ctrls.getUsers)
router.delete('/', [verifyAccessToken, isAdmin], ctrls.deleteUser)

module.exports = router
