const userRouter = require('./user')
const colorRouter = require('./color')
const sizeRouter = require('./size')
const categoryRouter = require('./category')
const brandRouter = require('./brand')
const voucherRouter = require('./voucher')
const productRouter = require('./product')
const initRoutes = (app) =>{
    app.use('/api/user', userRouter)
    app.use('/api/color', colorRouter)
    app.use('/api/size', sizeRouter)
    app.use('/api/category', categoryRouter)
    app.use('/api/brand', brandRouter)
    app.use('/api/product', productRouter)
}

module.exports = initRoutes