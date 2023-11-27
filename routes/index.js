const userRouter = require('./user')
const sizeRouter = require('./size')
const colorRouter = require('./color')
const categoryRouter = require('./category')
const brandRouter = require('./brand')
const voucherRouter = require('./voucher')
const productRouter = require('./product')
const orderRouter = require('./order')
const initRoutes = (app) =>{
    app.use('/api/user', userRouter)
    app.use('/api/voucher', voucherRouter)
    app.use('/api/colorRouter', colorRouter)
    app.use('/api/size', sizeRouter)
    app.use('/api/category', categoryRouter)
    app.use('/api/brand', brandRouter)
    app.use('/api/product', productRouter)
    app.use('/api/order', orderRouter)
}

module.exports = initRoutes