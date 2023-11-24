const router = require('express').Router()
const ctrls = require('../controllers/user')
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken')
router.post('/register', ctrls.register)
router.post('/login', ctrls.login)
router.get('/getcurrent',verifyAccessToken, ctrls.getCurrent)
router.get('/getusers',verifyAccessToken, isAdmin, ctrls.getUsers)

module.exports = router