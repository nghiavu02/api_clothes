const ctrls = require('../controllers/category')
const router = require('express').Router()
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken')
router.get('/:cid', ctrls.getCategory)
router.delete('/:cid',[verifyAccessToken, isAdmin], ctrls.deleteCategory)
router.put('/:cid',[verifyAccessToken, isAdmin], ctrls.updateCategory)
router.post('/',[verifyAccessToken, isAdmin], ctrls.createCategory)
router.get('/', ctrls.getCategorys)


module.exports = router