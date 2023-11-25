const ctrls = require('../controllers/product')
const router = require('express').Router()
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken')
router.get('/:pid', ctrls.getById)
// router.get('/name/:name', ctrls.getByName)
router.delete('/:pid',[verifyAccessToken, isAdmin], ctrls.deleteById)
router.put('/:pid',[verifyAccessToken, isAdmin], ctrls.updateById)
router.post('/',[verifyAccessToken, isAdmin], ctrls.create)
router.get('/', ctrls.getAll)


module.exports = router