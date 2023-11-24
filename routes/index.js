const userRouter = require('./user')
const colorRouter = require('./color')
const initRoutes = (app) =>{
    app.use('/api/user', userRouter)
    app.use('/api/color', colorRouter)
}

module.exports = initRoutes