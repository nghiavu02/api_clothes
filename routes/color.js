const router = require('express').Router()
const ctrls = require('../controllers/color')
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken')
router.get('/getColors', ctrls.getColors)
router.get('/:clid', ctrls.getColor)
router.delete('/:clid', [verifyAccessToken, isAdmin], ctrls.deleteColor)
router.put('/:clid',[verifyAccessToken, isAdmin], ctrls.updateColor )
router.post('/', [verifyAccessToken, isAdmin], ctrls.createColor)


module.exports = router