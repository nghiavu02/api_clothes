const ctrls = require('../controllers/brand')
const router = require('express').Router()
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken')
router.get('/:bid', ctrls.getBrand)
router.delete('/:bid',[verifyAccessToken, isAdmin], ctrls.deleteBrand)
router.put('/:bid',[verifyAccessToken, isAdmin], ctrls.updateBrand)
router.post('/',[verifyAccessToken, isAdmin], ctrls.createBrand)
router.get('/', ctrls.getBrands)


module.exports = router