const ctrls = require('../controllers/order')
const router = require('express').Router()
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken')
router.post('/',[verifyAccessToken], ctrls.create)
router.put('/:oid',[verifyAccessToken, isAdmin], ctrls.updateStatus)
router.get('/',[verifyAccessToken, isAdmin], ctrls.getUserOrder)
router.get('/getall',[verifyAccessToken, isAdmin], ctrls.getOrder)



module.exports = router