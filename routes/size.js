const ctrls = require('../controllers/size')
const router = require('express').Router()
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken')
router.get('/:sid', ctrls.getSize)
router.delete('/:sid',[verifyAccessToken, isAdmin], ctrls.deleteSize)
router.put('/:sid',[verifyAccessToken, isAdmin], ctrls.updateSize)
router.post('/',[verifyAccessToken, isAdmin], ctrls.createSize)
router.get('/', ctrls.getSizes)


module.exports = router