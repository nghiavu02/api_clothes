const ctrls = require('../controllers/voucher')
const router = require('express').Router()
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken')
router.get('/:vid', ctrls.getById)
router.get('/code/:code', ctrls.getVoucherByCode)
router.delete('/:vid',[verifyAccessToken, isAdmin], ctrls.deleteVoucher)
router.put('/:vid',[verifyAccessToken, isAdmin], ctrls.updateById)
router.post('/',[verifyAccessToken, isAdmin], ctrls.createVocher)
router.get('/', ctrls.getAll)


module.exports = router