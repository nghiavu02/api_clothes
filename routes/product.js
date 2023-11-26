const ctrls = require('../controllers/product')
const router = require('express').Router()
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken')
const fileUploader = require('../config/cloudinary.config')
router.get('/ratings',[verifyAccessToken], ctrls.ratings)
router.put('/cloudinary-upload/:pid',[verifyAccessToken, isAdmin],fileUploader.array('img', 10) , ctrls.uploadImage)
router.get('/:pid', ctrls.getById)
// router.get('/name/:name', ctrls.getByName)
router.delete('/:pid',[verifyAccessToken, isAdmin], ctrls.deleteById)
router.put('/:pid',[verifyAccessToken, isAdmin], ctrls.updateById)
router.post('/',[verifyAccessToken, isAdmin], ctrls.create)
router.get('/', ctrls.getAll)


module.exports = router